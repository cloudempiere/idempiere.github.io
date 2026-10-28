---
sidebar_label: "Plug-in upgrade checklist"
sidebar_position: 3.5
description: "Checks that prove a plug-in repository is ready for a target iDempiere version: Java level, build toolchain, bundle metadata, tests and clean-up."
tags: [migration, development, developer-documentation, reference]
applies_to: "all"
last_reviewed: "2026-10-28"
---

# Plug-in upgrade checklist

Use this checklist to prove that a plug-in repository builds and runs on a target iDempiere version. It does not repeat what changed between versions: that list is on the [Compare versions](/upgrade/compare) page, built from the migration notes and the platform requirements of each release. This page covers the checks the migration notes do not spell out, the ones you run against your own repository.

## Before you start

1. Open [Compare versions](/upgrade/compare?notes=1&audience=developer) and select your current version as **from** and the target as **to**.
2. Note the values in the **Platform changes** box (Java, Tycho, Maven, ZK, Jetty, database). The checks below compare your repository against them.
3. Tick every note in **Before you upgrade** once your repository is checked for it. Each note links to the full explanation.

:::tip

Run the checklist once per repository and keep the result in version control next to the code. It becomes the regression record for the next upgrade.

:::

## Java level

The Java version of the target is in the **Platform changes** box.

- [ ] Every `MANIFEST.MF` declares `Bundle-RequiredExecutionEnvironment: JavaSE-<target Java>`.
- [ ] No `build.properties` sets `jre.compilation.profile` to an older Java version. Tycho compiles with this value instead of the manifest value.
- [ ] POM properties that set the compiler level (`jdk.version`, `maven.compiler.release`, `maven.compiler.source`, `maven.compiler.target`) match the target Java version, including plain Maven test modules.
- [ ] Eclipse project files match: `.classpath` JRE container, `.settings/org.eclipse.jdt.core.prefs` compliance, `.launch` files and `targetJRE` in `.target` files.
- [ ] No code uses APIs removed from the JDK, for example `jdk.nashorn.*`, `sun.misc.BASE64*` or `Thread.stop()`. Packages such as `javax.xml.bind` and `javax.activation` are not part of the JDK any more: import them with `Import-Package` from the bundle of the target platform.
- [ ] The build machine and the CI agent run the target Java version (`java -version` in the build log).

## Build toolchain

- [ ] The plug-in parent POM uses the Tycho version shown in **Platform changes**.
- [ ] The Maven version is pinned with the Maven Wrapper, as in iDempiere core: copy `mvnw`, `mvnw.cmd` and `.mvn/wrapper/maven-wrapper.properties` from the core repository of the target version, and build with `./mvnw`. If `.gitignore` ignores `.mvn/`, exclude `.mvn/wrapper/` from that rule.
- [ ] Every `<repository>` URL, and every property that feeds one, points to the p2 repository of the target version, not the old one.
- [ ] No active repository points to a local path (`file:/...`) that exists only on one machine. Keep local paths in an opt-in Maven profile.
- [ ] The repository builds from a fresh clone with one command (`./mvnw clean verify`) on a machine that never built the old version.
- [ ] The CI job calls `./mvnw`, not the `mvn` of the build image, and prints `./mvnw -version` in the build log.

## Bundle metadata

- [ ] `Bundle-Version` of each plug-in follows your versioning rule for the target, and the feature and p2 versions are raised with it. See [Distributing plug-ins](./distributing-plugins.md).
- [ ] The `bundle-version` range on `Require-Bundle: org.adempiere.base` and the other core bundles accepts the target version and excludes versions you no longer support.
- [ ] Bundles that the migration notes say moved out of core are declared explicitly in `MANIFEST.MF`.
- [ ] Runtime bundles do not require test libraries such as `org.junit`. Tests live in a separate test bundle or fragment.

## Code

- [ ] Every bundle compiles against the target version without errors. This is the real check for removed and moved APIs; fix every error before you continue.
- [ ] Deprecation warnings raised by the target version are listed, and those marked `forRemoval` have an owner.
- [ ] For each note ticked in **Before you upgrade**, the repository was searched for the class, method, column or setting it names.
- [ ] Every `Env.parseContext` call was checked against where its result goes. Since iDempiere 12 the overloads without a `forSQL` argument escape quotes (`forSQL` is `true`), which is right for SQL. When the result is text, such as a message, a field value or a file name, call the overload with `forSQL` set to `false`, or every quote in the text comes out doubled. See [New Env.parseContext parameter](../../migration-notes/v12/technical-notes.md#new-envparsecontext-parameter).

Search commands for patterns that compile but fail at runtime, run in the root of the repository:

```shell
# SQL bind parameters without a type
git grep -nE '\? +IS +(NOT +)?NULL' -- '*.java' '*.sql'

# Java level overrides
git grep -nE 'jre\.compilation\.profile|<(maven\.compiler\.(release|source|target)|jdk\.version)>' -- '*.properties' '*pom.xml'

# Local repository paths
git grep -n 'file:/' -- '*pom.xml'

# Env.parseContext calls: SQL keeps the default, text needs forSQL=false
git grep -n 'Env.parseContext(' -- '*.java'
```

## Database and migration scripts

- [ ] Your plug-in migration scripts apply without errors after the core migration scripts of the target (`RUN_SyncDB`).
- [ ] Custom views, functions and triggers that block core migration scripts are dropped before the sync and recreated after it.
- [ ] New migration scripts follow the conventions of the target version, as described in its migration notes.
- [ ] 2Pack files packed in the old version import without errors on a test database of the target version.

## Tests

- [ ] Tests compile and run against the test framework of the target core (`org.idempiere.test`).
- [ ] Integration tests run on a fresh GardenWorld database of the target version.
- [ ] CI runs the tests on every build of the upgrade branch. A build with tests skipped does not count as verified.
- [ ] Every behavior change from **Before you upgrade** that touches the repository has a test or a manual test case.

## Clean up

- [ ] Build scripts, CI files and README files do not name the old Java, Tycho or core version as current.
- [ ] POM properties and repository URLs of old versions are removed.
- [ ] Bundles that are no longer built (not in any POM module list or feature) are removed or ported.

## Deploy and verify

- [ ] On a staging server of the target version, the plug-ins install from your p2 repository. See [Distributing plug-ins](./distributing-plugins.md).
- [ ] In the OSGi console every plug-in bundle is `ACTIVE`, and every component it registers is satisfied.
- [ ] The functional regression tests of your implementation pass.

For backup, staging and iteration advice see [Best practices for migrating to new iDempiere versions](/docs/basic-installation/idempiere-upgrade-guide).

:::warning

Do not upgrade production until every repository in scope passes this checklist and the staging test passes.

:::
