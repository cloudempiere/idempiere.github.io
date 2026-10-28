#!/usr/bin/env node
// Updates platform-requirements/<version>.yml from the iDempiere source, so the
// values on the Compare versions page are read from the code, not typed in.
//
// It also writes docs/migration-notes/platform-requirements.md, a table of all
// releases, so the values are on a docs page too: in llms.txt, llms-full.txt
// and the Markdown copy of the page, not only in the Compare versions page.
//
// Usage: node scripts/sync-platform-requirements.js [--check] [version ...]
// With no versions, updates every file in platform-requirements/.
//   --check  changes nothing; lists the values that differ from the source,
//            and the page if it is out of date, and exits 1 if there are any.
//
// Each release is read from its branch (release-<version>). A release without
// a branch yet is read from master. Only the values below are synced; values
// that are not in the code (jetty, postgresql, oracle) stay as written. A value
// that already matches the source is left alone, including its source link.

const fs = require('fs');
const yaml = require('js-yaml');

const DIR = 'platform-requirements';
const RAW = 'https://raw.githubusercontent.com/idempiere/idempiere';
const BLOB = 'https://github.com/idempiere/idempiere/blob';
const PARENT_POM = 'org.idempiere.parent/pom.xml';
const MAVEN_WRAPPER = '.mvn/wrapper/maven-wrapper.properties';

// Requirement name -> where its value is in the source.
const SYNCED = {
  java: { file: PARENT_POM, read: (text) => property(text, 'jdk.version') },
  zk: { file: PARENT_POM, read: (text) => property(text, 'zk.version') },
  tycho: { file: PARENT_POM, read: (text) => property(text, 'tycho.version') },
  maven: {
    file: MAVEN_WRAPPER,
    read: (text) => {
      const match = /apache-maven-([\d.]+)-bin/.exec(text || '');
      return match ? `${match[1]} (Maven Wrapper)` : null;
    },
  },
};

function property(pom, name) {
  const match = new RegExp(`<${name.replace(/\./g, '\\.')}>([^<$]+)</`).exec(pom || '');
  return match ? match[1].trim() : null;
}

async function fetchText(branch, file) {
  const res = await fetch(`${RAW}/${branch}/${file}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`${branch}/${file}: HTTP ${res.status}`);
  return res.text();
}

async function branchFor(version) {
  const release = `release-${version}`;
  return (await fetchText(release, PARENT_POM)) !== null ? release : 'master';
}

async function sync(file, check) {
  const rel = `${DIR}/${file}`;
  const data = yaml.load(fs.readFileSync(rel, 'utf8'), { schema: yaml.CORE_SCHEMA });
  const branch = await branchFor(data.version);
  const sources = {};
  const changes = [];

  for (const [name, spec] of Object.entries(SYNCED)) {
    if (!(spec.file in sources)) sources[spec.file] = await fetchText(branch, spec.file);
    const value = spec.read(sources[spec.file]);
    if (!value) continue;
    const current = data.requirements[name];
    if (current && current.value === value) continue;
    changes.push(`${rel}: ${name} ${current ? current.value : '(none)'} -> ${value} (${branch})`);
    data.requirements[name] = { value, source: `${BLOB}/${branch}/${spec.file}` };
  }

  if (changes.length > 0 && !check) fs.writeFileSync(rel, format(data));
  return changes;
}

// Writes the file in the layout the hand-written files use: quoted values,
// unquoted links. The schema allows no other fields.
function format(data) {
  const lines = [`version: "${data.version}"`, 'requirements:'];
  for (const [name, req] of Object.entries(data.requirements)) {
    lines.push(`  ${name}:`, `    value: ${JSON.stringify(req.value)}`, `    source: ${req.source}`);
  }
  return `${lines.join('\n')}\n`;
}

const PAGE = 'docs/migration-notes/platform-requirements.md';
const LABELS = {
  java: 'Java',
  tycho: 'Tycho',
  maven: 'Maven',
  zk: 'ZK',
  jetty: 'Jetty',
  postgresql: 'PostgreSQL',
  oracle: 'Oracle',
};

function compareVersions(a, b) {
  const pa = a.split('.').map(Number);
  const pb = b.split('.').map(Number);
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    const d = (pa[i] || 0) - (pb[i] || 0);
    if (d !== 0) return d;
  }
  return 0;
}

// The page body, built from every file in platform-requirements/. A value
// carries forward to later releases until a later file changes it, as on the
// Compare versions page; carried values are shown in italics.
function renderBody() {
  const releases = fs
    .readdirSync(DIR)
    .filter((f) => /\.ya?ml$/.test(f))
    .map((f) => yaml.load(fs.readFileSync(`${DIR}/${f}`, 'utf8'), { schema: yaml.CORE_SCHEMA }))
    .sort((a, b) => compareVersions(a.version, b.version));

  const header = `| | ${releases.map((r) => `iDempiere ${r.version}`).join(' | ')} |`;
  const rule = `|---|${releases.map(() => '---').join('|')}|`;
  const rows = Object.entries(LABELS)
    .filter(([key]) => releases.some((r) => r.requirements[key]))
    .map(([key, label]) => {
      let last = null;
      const cells = releases.map((r) => {
        const req = r.requirements[key];
        if (req) {
          last = req.value;
          return `[${req.value}](${req.source})`;
        }
        return last ? `_${last}_` : '';
      });
      return `| ${label} | ${cells.join(' | ')} |`;
    });

  return [
    '# Platform requirements',
    '',
    'The Java, build tool, ZK, Jetty and database versions each iDempiere release needs. Every value links to its source. A value in italics carries forward from an earlier release.',
    '',
    'To see what changed between two versions together with their migration notes, use [Compare versions](/upgrade/compare). To check a plug-in repository against these values, use the [Plug-in upgrade checklist](/docs/basic-development/plugin-development/plugin-upgrade-checklist).',
    '',
    header,
    rule,
    ...rows,
    '',
    ':::note',
    '',
    'This page is generated by `scripts/sync-platform-requirements.js` from `platform-requirements/*.yml`. Do not edit it by hand: change the YAML files, or let the weekly sync read the values from the iDempiere source.',
    '',
    ':::',
    '',
  ].join('\n');
}

// Returns true when the page differs from the data. The review date is only
// changed when the table changes, so an unchanged run leaves the file alone.
function writePage(check) {
  const body = renderBody();
  const current = fs.existsSync(PAGE) ? fs.readFileSync(PAGE, 'utf8') : '';
  if (current.slice(current.indexOf('\n---\n') + 5) === `\n${body}`) return false;
  if (!check) {
    const today = new Date().toISOString().slice(0, 10);
    const front = [
      '---',
      'sidebar_label: "Platform requirements"',
      'sidebar_position: 0',
      'description: "Java, Tycho, Maven, ZK, Jetty and database versions required by each iDempiere release, with a source for every value."',
      'tags: [migration, installation, development, reference]',
      'applies_to: "all"',
      `last_reviewed: "${today}"`,
      '---',
    ].join('\n');
    fs.writeFileSync(PAGE, `${front}\n\n${body}`);
  }
  return true;
}

async function main() {
  const args = process.argv.slice(2);
  const check = args.includes('--check');
  const versions = args.filter((a) => !a.startsWith('--'));
  const files = fs
    .readdirSync(DIR)
    .filter((f) => /\.ya?ml$/.test(f))
    .filter((f) => versions.length === 0 || versions.includes(f.replace(/\.ya?ml$/, '')))
    .sort();

  const changes = [];
  for (const file of files) changes.push(...(await sync(file, check)));
  if (writePage(check)) changes.push(`${PAGE}: out of date`);

  if (changes.length === 0) {
    console.log('Platform requirements match the iDempiere source.');
    return;
  }
  console.log(changes.join('\n'));
  if (check) process.exitCode = 1;
}

main().catch((e) => {
  console.error(e.message);
  process.exitCode = 2;
});
