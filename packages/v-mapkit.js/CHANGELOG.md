# [0.3.0](https://github.com/geoql/v-mapkit.js/compare/v0.2.3...v0.3.0) (2022-11-27)

### Bug Fixes

- **deps:** bump actions/checkout from 2 to 3 ([a9f7da2](https://github.com/geoql/v-mapkit.js/commit/a9f7da29851e3bdec4347099575de10bb4205a09))
- **deps:** bump actions/setup-node from 2.4.1 to 2.5.0 ([be273a2](https://github.com/geoql/v-mapkit.js/commit/be273a2acff41eaeff59b95c28315e82fc0c262e))
- **deps:** bump actions/setup-node from 2.5.0 to 2.5.1 ([29af56d](https://github.com/geoql/v-mapkit.js/commit/29af56d62d359b3721da9bdf8a5ece57bc28cc7c))
- **deps:** bump actions/setup-node from 2.5.1 to 3 ([c6ce791](https://github.com/geoql/v-mapkit.js/commit/c6ce7917e867da2a98f7c16fb73585736227dd01))
- **deps:** bump ejs from 3.1.6 to 3.1.7 ([99c4296](https://github.com/geoql/v-mapkit.js/commit/99c429682c5727ca5c3d60822566176862ee43b0))
- **deps:** bump follow-redirects from 1.14.4 to 1.14.8 ([772528f](https://github.com/geoql/v-mapkit.js/commit/772528f7c5d9a7d912bbefd52510f365559fb694))
- **deps:** bump minimist from 1.2.5 to 1.2.6 ([8a8e13c](https://github.com/geoql/v-mapkit.js/commit/8a8e13cfa2aa00cb9a33a786496bace022a2a54a))
- **deps:** bump wearerequired/lint-action from 1 to 2 ([0510602](https://github.com/geoql/v-mapkit.js/commit/0510602e7ff52872273c1d55bd5164f033da1618))
- set default registry as `npm` ([3a600a7](https://github.com/geoql/v-mapkit.js/commit/3a600a73fb1c81b3a5c4d2d269d772d2e3a6f332))
- use output files from `package.json` ([a276f7a](https://github.com/geoql/v-mapkit.js/commit/a276f7a94232df1b216d86d1e494fef9c0012f68))

### Features

- add support for `nvm` ([55dfe11](https://github.com/geoql/v-mapkit.js/commit/55dfe1142f02ae684b0cc70f1f0f6113268abb89))
- update `.vscode` setting(s) ([d318b05](https://github.com/geoql/v-mapkit.js/commit/d318b0582e3bcd020d8025e58aa48f6eebf1bbee))

## [1.0.0](https://github.com/geoql/v-mapkit.js/compare/v0.3.0...v1.0.0) (2026-06-12)


### ⚠ BREAKING CHANGES

* package renamed from v-mapkit.js to @geoql/v-mapkit.js
* package no longer ships a CommonJS build. Consumers must use ESM (import) or a bundler that handles ESM.

### Features

* convert to pnpm monorepo with v-mapkit.js library and mapkit-cn app ([c84d9fa](https://github.com/geoql/v-mapkit.js/commit/c84d9fae3ca384b039c379e240a0811191e370d3))
* v1 revival — monorepo restructure + 18 components + mapkit-cn app ([3676fad](https://github.com/geoql/v-mapkit.js/commit/3676fad968554748438a60b9a6501e3207100851))


### Bug Fixes

* address review findings, doctor issues, and add design system ([4a2bf1f](https://github.com/geoql/v-mapkit.js/commit/4a2bf1fc0936b826817c45c7c2089a887e5f800f))
* **build:** restore @tsdown/css required by vp pack ([51ce292](https://github.com/geoql/v-mapkit.js/commit/51ce29281d10c4f4a309b2a896aba4a023368ab0))
* **ci:** add test:coverage script, build tools, remove unused deps ([924caf9](https://github.com/geoql/v-mapkit.js/commit/924caf905dc6455a3471f74c1571d514fb740bb4))
* **ci:** add wrangler devDependency to mapkit-cn for deploy ([e8cf3bf](https://github.com/geoql/v-mapkit.js/commit/e8cf3bf0a5913bef6c226c255f5f5aa37a0d7177))
* **deps:** add @vitest/coverage-v8@3 for test:coverage ([6a03951](https://github.com/geoql/v-mapkit.js/commit/6a039516ad9d18766fa8239f118da52128e7a5f0))
* docs prose styles, missing routes, prepare script, dead code ([345de39](https://github.com/geoql/v-mapkit.js/commit/345de39d146bd019eb61a7cfb937cc5aad0de924))
* **jsr:** align jsr.json with project conventions ([d889fe1](https://github.com/geoql/v-mapkit.js/commit/d889fe16990e45889b567b2a55321f5ab09cf797))
* **jsr:** drop style.css export — JSR cannot import CSS modules ([bba587d](https://github.com/geoql/v-mapkit.js/commit/bba587d0ad9c393b5211f5cd3c6985a7a35e3243))
* **mapkit-cn:** hoist inline annotation object in clustering.vue ([25ff87a](https://github.com/geoql/v-mapkit.js/commit/25ff87a074e2c09191e504b8cc048a704b32e47f))
* remove last [@geoql](https://github.com/geoql) references in .npmrc and doctor.yml ([f953973](https://github.com/geoql/v-mapkit.js/commit/f953973d60f46a51b3f0b44d781a3706784f9fb9))


### Documentation

* add AGENTS.md guides + CLAUDE.md symlink ([66c7bf4](https://github.com/geoql/v-mapkit.js/commit/66c7bf4aa27a83d7f9614065a2b3cf35a82d7942))


### Miscellaneous

* delete vscode settings ([952b5ba](https://github.com/geoql/v-mapkit.js/commit/952b5ba287c3ad2768244da52f0d27d11f2da3a0))
* **deps:** update all dependencies to latest (incl. majors) ([c118e06](https://github.com/geoql/v-mapkit.js/commit/c118e0664ee40278d8c0ffa65a197ba2654ecfae))
* **deps:** upgrade all dependencies + bump pnpm to 11.6.0 ([d0b6402](https://github.com/geoql/v-mapkit.js/commit/d0b64023514ad0e6064f4c63daf4c30fb36f4cf6))
* inline wrangler config into nuxt.config.ts, remove stylelint ([991638a](https://github.com/geoql/v-mapkit.js/commit/991638a28cb02079a452098d29f2812482f99c55))
* release 1.0.0 ([a8dbff1](https://github.com/geoql/v-mapkit.js/commit/a8dbff1ae1b8aa696c6154f3d95954fb81030525))


### Code Refactoring

* **deps:** centralize versions in pnpm catalogs ([cb0baed](https://github.com/geoql/v-mapkit.js/commit/cb0baedecedd0d1d94409178319f18c93538cb0d))
* drop [@geoql](https://github.com/geoql) scope from workspace package names ([0b53166](https://github.com/geoql/v-mapkit.js/commit/0b53166f1b70dfd369bab6df624f83049b2c19af))
* publish as scoped @geoql/v-mapkit.js + fix release pipeline ([2fb6a8b](https://github.com/geoql/v-mapkit.js/commit/2fb6a8bd431f429c95cf0c5d4e9189878f2bc683))
* **tests:** rename composable spec files to kebab-case ([31184be](https://github.com/geoql/v-mapkit.js/commit/31184beddb91e37bdd42989a822b39090b5430c3))
* **v-mapkit.js:** centralize composable types in types/index.ts ([734f4dc](https://github.com/geoql/v-mapkit.js/commit/734f4dce864c5b19069ce0b4afa8288676768d41))
* **v-mapkit.js:** rename composable files to kebab-case ([12b1415](https://github.com/geoql/v-mapkit.js/commit/12b14151e329639c7ae9446858bc47687f4f834e))


### Build System

* drop CJS output, ship ESM-only ([1da868e](https://github.com/geoql/v-mapkit.js/commit/1da868e6c439633b066031b237c16507b6a70936))

## [0.2.3](https://github.com/geoql/v-mapkit.js/compare/v0.2.2...v0.2.3) (2021-10-22)

### Bug Fixes

- **deps:** bump actions/setup-node from 2.4.0 to 2.4.1 ([3bc1d13](https://github.com/geoql/v-mapkit.js/commit/3bc1d13b4ab7ad75d64eadfb39f14e03803586e2))

## [0.2.2](https://github.com/geoql/v-mapkit.js/compare/v0.2.1...v0.2.2) (2021-08-16)

### Bug Fixes

- bump dependencies ([c3eb734](https://github.com/geoql/v-mapkit.js/commit/c3eb734ef990218a2c52f157ed6a2f7df8909e1e))

## [0.2.1](https://github.com/geoql/v-mapkit.js/compare/v0.2.0...v0.2.1) (2021-08-16)

### Bug Fixes

- correct `ui` scope ([70d08b5](https://github.com/geoql/v-mapkit.js/commit/70d08b5ed46a7ecb3440404cb6a874e0f9fc4d8a))
- update CI workflow to ensure ([ed514ff](https://github.com/geoql/v-mapkit.js/commit/ed514ff8d269752a7375c3cf2db40131e999319b))
- update correct events ([9c2ae3e](https://github.com/geoql/v-mapkit.js/commit/9c2ae3ee1c657b5cbe39a7363a614af45834ad92))
- update store ([799f625](https://github.com/geoql/v-mapkit.js/commit/799f625e7f748dff600d5a0bbbc4e1c873e1e554))

# [0.2.0](https://github.com/geoql/v-mapkit.js/compare/v0.1.1...v0.2.0) (2021-08-08)

### Features

- **ts:** migrate `CircleOverlay` props to `index.d.ts` ([debcb37](https://github.com/geoql/v-mapkit.js/commit/debcb37b5c31c299ae5e2d6dea10740588d61cb8))
- **ts:** migrate `MarkerAnnoation` props to `index.d.ts` ([f3da5ca](https://github.com/geoql/v-mapkit.js/commit/f3da5cac034382199ed32857cbbf166560bb34da))
- **ts:** migrate `PolygonOverlayProps` to `index.d.ts` ([fcc7cbb](https://github.com/geoql/v-mapkit.js/commit/fcc7cbbbde5022ebfb5a47087570c387cbce4080))
- **ts:** migrate Image Annotation props to `index.d.ts` ([b4d0dcf](https://github.com/geoql/v-mapkit.js/commit/b4d0dcf4046eb3ab34f4eaa43a9434afaf562445))
- **ts:** migrate remaining overlays to `index.d.ts` ([65a4f84](https://github.com/geoql/v-mapkit.js/commit/65a4f845295763f47b9a0e1311c61349516775ca))

## [0.1.1](https://github.com/geoql/v-mapkit.js/compare/v0.1.0...v0.1.1) (2021-08-08)

### Bug Fixes

- **deps:** bump actions/setup-node from 2.3.1 to 2.4.0 ([c0d4020](https://github.com/geoql/v-mapkit.js/commit/c0d402006b92f02d2e4e0178bbe25d5f13c11e27))
- remove `NODE_AUTH_TOKEN` from `shipjs trigger` ([f17a891](https://github.com/geoql/v-mapkit.js/commit/f17a8912992a65b809678799f9d3e76bec32e098))

# [0.1.0](https://github.com/geoql/v-mapkit.js/compare/v0.0.3...v0.1.0) (2021-08-08)

### Bug Fixes

- **deps:** bump actions/setup-node from 2.3.0 to 2.3.1 ([637070b](https://github.com/geoql/v-mapkit.js/commit/637070bd7f05b93f9203f4e1a8e8bab6503a536b))

### Features

- add components ([996c61c](https://github.com/geoql/v-mapkit.js/commit/996c61c2720be8fe71bdf35ffb26d4735a405b00))

## [0.0.3](https://github.com/geoql/v-mapkit.js/compare/v0.0.2...v0.0.3) (2021-07-30)

### Bug Fixes

- add pull_request scope ([9c26d1f](https://github.com/geoql/v-mapkit.js/commit/9c26d1fb12b781a942809719f1317ccad3de8e09))
- check CI if !dependabot ([00bbafb](https://github.com/geoql/v-mapkit.js/commit/00bbafb25058d28b6461bc3d50e1f0339a39c7e0))
- correct place ([e92081d](https://github.com/geoql/v-mapkit.js/commit/e92081d896842096d48f891e3cbcf21dc2621f8f))
- **deps:** bump actions/setup-node from 2.2.0 to 2.3.0 ([38a5728](https://github.com/geoql/v-mapkit.js/commit/38a57288020c7a1dc8ec41d6d8d5329d60746697))
- **ts:** update tsconfig as per Vue 3 ([2e0dc3e](https://github.com/geoql/v-mapkit.js/commit/2e0dc3ef55ceb207b3c6f92aa1c66263bbe80867))
- update CI ([1d54c04](https://github.com/geoql/v-mapkit.js/commit/1d54c046a0dfd5979b673144552515185c3cfaf2))
- update ci workflow ([d1a0564](https://github.com/geoql/v-mapkit.js/commit/d1a0564e9d93437b91aea9db27ad7671f71e4338))
- update shims for vue ([0210e0b](https://github.com/geoql/v-mapkit.js/commit/0210e0b43c065e64f8e15b90306960e18227fa44))
- update workflow ([6bc9e5e](https://github.com/geoql/v-mapkit.js/commit/6bc9e5efa9238a75dcd0df82c5dd198fbe282e5a))
- update workflow to use `pull_request_target` ([e71af7a](https://github.com/geoql/v-mapkit.js/commit/e71af7aa2a27d3b400d0a87fe9203c32ef2a68c7))
- use push & pull_request events ([784b52e](https://github.com/geoql/v-mapkit.js/commit/784b52ea5f6d5a8e0ccc062c43c12c8d092ba0df))

### Features

- **$map:** add default slot ([28d8db1](https://github.com/geoql/v-mapkit.js/commit/28d8db1c3e9ac6ba77c08402ab233a27c6d79fb5))
- installable & directly usable components ([102311b](https://github.com/geoql/v-mapkit.js/commit/102311b3ff5b7f22de9326c9c82bc7d0daf9190f))
- **ts:** add basic typings ([c93b8e6](https://github.com/geoql/v-mapkit.js/commit/c93b8e6a581b740a5984f87f742df2c0904c293f))
- **ts:** strictly type props ([4c8ea19](https://github.com/geoql/v-mapkit.js/commit/4c8ea1921de72c7d44b50c10c98c7e1d8f7dc26a))

## [0.0.2](https://github.com/geoql/v-mapkit.js/compare/v0.0.1...v0.0.2) (2021-07-03)

### Bug Fixes

- better error handling for `loadMapKit()` ([2147b2b](https://github.com/geoql/v-mapkit.js/commit/2147b2b4a97cca899a091d7793915974a3f4a0d2))
- **deps:** bump actions/setup-node from 2.1.5 to 2.2.0 ([5ece72d](https://github.com/geoql/v-mapkit.js/commit/5ece72d949ba05d198eed4657cf0c2748585de89))

## 0.0.1 (2021-06-25)

### Features

- init the VMap with correct options ([7774d3c](https://github.com/geoql/v-mapkit.js/commit/7774d3c3079dba0a3282a4e1d3dc7ef430210e64))
- minor housekeeping of utils ([44c40d8](https://github.com/geoql/v-mapkit.js/commit/44c40d86696029cff4d4c60b47a4cbc09430bf36))
