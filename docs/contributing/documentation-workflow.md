---
sidebar_position: 1
title: Documentation Workflow
description: Guide for contributing to iDempiere documentation
---

# Documentation Workflow

This guide covers the tools, processes, and standards for maintaining iDempiere documentation.

## Content Status Management

Every documentation page has a `status` in its frontmatter:

| Status | Meaning | Action |
|--------|---------|--------|
| `draft` | Needs content | Write or expand content |
| `review` | Needs review | Review for accuracy |
| `approved` | Ready | Published and maintained |

### Check Status

```bash
# Summary of all docs
python3 scripts/doc-status.py --summary

# List draft pages needing content
python3 scripts/doc-status.py --status draft

# Check specific folder
python3 scripts/doc-status.py --path docs/release-notes
```

### Status Rules

- **draft**: Pages with less than 20 words of content
- **approved**: Pages with substantial content (20+ words)
- Draft pages display a warning banner automatically

## Wiki Migration

Release notes are migrated from [wiki.idempiere.org](https://wiki.idempiere.org).

### Migration Script

```bash
# Migrate single page
python3 scripts/migrate_wiki.py --page "NF1.0 Feature Name" --version v1.0

# Migrate entire version
python3 scripts/migrate_wiki.py --version v1.0

# Re-migrate existing files (updates formatting)
python3 scripts/migrate_wiki.py --remigrate v1.0

# Dry run (preview changes)
python3 scripts/migrate_wiki.py --version v1.0 --dry-run
```

### What Migration Does

1. **Fetches** wiki content via MediaWiki API
2. **Converts** MediaWiki syntax to Markdown
3. **Downloads** images to `static/img/release-notes/`
4. **Extracts** title from wiki heading (strips "Feature:" prefix)
5. **Improves** grammar (e.g., "X Improved" → "Improved X")
6. **Adds** frontmatter with tags and description
7. **Escapes** MDX-incompatible characters (`{}`, `<>` in braces)
8. **Preserves** manual additions (like `:::info` blocks) during remigration

### Cached Content

Wiki responses are cached in `scripts/cache/` for 24 hours. Use `--remigrate` to update existing pages from cache without hitting the wiki server.

## AI-Assisted Content

### JIRA Feature Introduction

Generate feature introductions from JIRA data:

```bash
# Invoke via Claude Code skill
/jira-intro docs/release-notes/v1.0/functional/feature-name.md
```

This:
1. Reads the markdown file
2. Fetches JIRA issue data (summary, description, comments)
3. Synthesizes a `:::info Feature Overview` callout
4. Inserts it after frontmatter

### Callout Types by Goal

| Goal | Callout |
|------|---------|
| Functional | `:::info` |
| Usability | `:::tip` |
| Technical | `:::note` |
| Security | `:::caution` |

## Documentation Standards

### Naming Conventions

- **iDempiere entities**: Capitalize - "Business Partner", "Sales Order"
- **Specific records**: Quote - "Azalea Bush" Product
- **Navigation**: Use `=>` - Sales Order window => Order Line subtab

### Frontmatter Template

```yaml
---
status: approved
id: feature-slug
title: "Feature Title"
sidebar_label: "Feature Title"
description: "Brief description for SEO"
tags: [v1.0, functional]
---
```

### Image Captions

Images with captions render as:

```markdown
![Alt text](pathname:///img/path/image.png)

_Caption text here_
```

### Internal Links

- **Migrated pages**: Use relative links `./other-feature.md`
- **Wiki pages**: Link to `https://wiki.idempiere.org/en/Page_Name`
- **Sponsors**: Link to `/docs/sponsors/Sponsor_Name`

## Release Notes Structure

```
docs/release-notes/
├── index.md              # Main release notes page
├── v1.0/
│   ├── _category_.json   # Sidebar order & label
│   ├── index.md          # Version intro + DocCardList
│   ├── functional/
│   │   ├── _category_.json
│   │   └── feature-name.md
│   ├── technical/
│   ├── security/
│   ├── architecture/
│   └── user-experience/
└── v2.0/
    └── ...
```

### Version Index Template

Each version has an introduction with:
- Release year
- Focus/theme
- Key highlights
- `<DocCardList />` for feature cards

## Commands Reference

```bash
# Development
npm start              # Dev server
npm run build          # Production build (validates links)
npm run clear          # Clear cache

# Documentation status
python3 scripts/doc-status.py --summary

# Wiki migration
python3 scripts/migrate_wiki.py --help

# JIRA integration (via Claude Code)
/jira-intro <path-to-md>
```

## Contributing

1. Check `--status draft` for pages needing content
2. Follow naming conventions and standards
3. Add `status: approved` when content is complete
4. Submit PR for review
