## <small>3.4.2 (2025-01-28)</small>

* chore : bump version to 3.4.2 ([e5a8ec6](https://github.com/eduardoleolim/electron-esbuild/commit/e5a8ec6))
* build: clean package.json before publishing ([4b8aec2](https://github.com/eduardoleolim/electron-esbuild/commit/4b8aec2))
* chore: add 3.4.1 to changelog ([7f3d81a](https://github.com/eduardoleolim/electron-esbuild/commit/7f3d81a))



## <small>3.4.1 (2025-01-27)</small>

* chore: add 3.4.0 to changelog ([969f7a3](https://github.com/eduardoleolim/electron-esbuild/commit/969f7a3))
* chore: add example using vite with react, typescript and tailwind ([173cb0e](https://github.com/eduardoleolim/electron-esbuild/commit/173cb0e))
* chore: bump version to 3.4.1 ([4888a80](https://github.com/eduardoleolim/electron-esbuild/commit/4888a80))
* chore: downgrade to rimraf with node 18 support ([f501e3f](https://github.com/eduardoleolim/electron-esbuild/commit/f501e3f))
* chore: lint configs ([4a18afc](https://github.com/eduardoleolim/electron-esbuild/commit/4a18afc))
* chore: lint source ([fc870c6](https://github.com/eduardoleolim/electron-esbuild/commit/fc870c6))
* chore: update dependencies ([e37c877](https://github.com/eduardoleolim/electron-esbuild/commit/e37c877))
* chore: update esbuild and prettier ([815ae84](https://github.com/eduardoleolim/electron-esbuild/commit/815ae84))
* chore: update examples ([0e96483](https://github.com/eduardoleolim/electron-esbuild/commit/0e96483))
* chore: update husky and lint-staged ([3a23f16](https://github.com/eduardoleolim/electron-esbuild/commit/3a23f16))
* chore(builder): remove import alias ([fed6806](https://github.com/eduardoleolim/electron-esbuild/commit/fed6806))
* chore(husky): remove deprecated config of pre-commit ([31f6d61](https://github.com/eduardoleolim/electron-esbuild/commit/31f6d61))
* chore(lint-staged): remove unnecesary git add ([05f4486](https://github.com/eduardoleolim/electron-esbuild/commit/05f4486))
* ci: enable provenance for npm publish action ([6621e69](https://github.com/eduardoleolim/electron-esbuild/commit/6621e69))
* ci: publish test report using github-test-reporter ([8386d98](https://github.com/eduardoleolim/electron-esbuild/commit/8386d98))
* ci: set explicit version of justincy/github-action-npm-release ([d20372f](https://github.com/eduardoleolim/electron-esbuild/commit/d20372f))
* ci: update actions ([cb9bbd6](https://github.com/eduardoleolim/electron-esbuild/commit/cb9bbd6))
* ci: update permissions in publish workflow to allow write access ([8c0249c](https://github.com/eduardoleolim/electron-esbuild/commit/8c0249c))
* tests(config): replace InMemoryConfigParser with InMemoryConfigReader and update tests ([3c1eb74](https://github.com/eduardoleolim/electron-esbuild/commit/3c1eb74))
* refactor(config-parser): simplify parser and fix no-explicit-any errors ([a65a0aa](https://github.com/eduardoleolim/electron-esbuild/commit/a65a0aa))
* refactor(config): introduce ConfigReader abstraction and update ConfigParser to use it ([5f3af65](https://github.com/eduardoleolim/electron-esbuild/commit/5f3af65))
* refactor(config): replace map fuctions for forEach fuctions ([71d482e](https://github.com/eduardoleolim/electron-esbuild/commit/71d482e))
* docs: define abstraction of config reader ([9d85ac0](https://github.com/eduardoleolim/electron-esbuild/commit/9d85ac0))
* test(config-data): update valid and invalid output config data ([26d7555](https://github.com/eduardoleolim/electron-esbuild/commit/26d7555))
* test(config): add jest-ctrf-json-reporter and update configuration ([db46662](https://github.com/eduardoleolim/electron-esbuild/commit/db46662))
* test(loader-config): add tests for invalid loader configuration handling ([e41bdf2](https://github.com/eduardoleolim/electron-esbuild/commit/e41bdf2))
* test(output-config): add tests for invalid output config handling ([27352c7](https://github.com/eduardoleolim/electron-esbuild/commit/27352c7))
* test(output-config): improve error handling and type safety in tests ([44648d8](https://github.com/eduardoleolim/electron-esbuild/commit/44648d8))
* test(output-config): refactor tests to use InMemoryConfigParser and add valid output config test ([38e34ea](https://github.com/eduardoleolim/electron-esbuild/commit/38e34ea))
* test(resource-config): add tests for resource configuration validation and parsing ([99e9765](https://github.com/eduardoleolim/electron-esbuild/commit/99e9765))
* feat(config-parser): add InMemoryConfigParser for config file handling ([ee8da41](https://github.com/eduardoleolim/electron-esbuild/commit/ee8da41))
* perf(builder): start vite server faster ([c049eed](https://github.com/eduardoleolim/electron-esbuild/commit/c049eed))



## 3.4.0 (2024-10-27)

* chore: add example using TailwindCSS ([052a57e](https://github.com/eduardoleolim/electron-esbuild/commit/052a57e))
* chore: add version 3.3.0 to changelog ([c6b72c5](https://github.com/eduardoleolim/electron-esbuild/commit/c6b72c5))
* chore: bump version to 3.4.0 ([601b298](https://github.com/eduardoleolim/electron-esbuild/commit/601b298))
* chore: fix examples' links ([82f7707](https://github.com/eduardoleolim/electron-esbuild/commit/82f7707))
* chore: update README ([e861912](https://github.com/eduardoleolim/electron-esbuild/commit/e861912))
* refactor(config): get esbuild or vite config's path from base property ([3ce217b](https://github.com/eduardoleolim/electron-esbuild/commit/3ce217b))
* docs: rename property "baseConfigEntryPoint" according implementation of BaseConfig ([22171e7](https://github.com/eduardoleolim/electron-esbuild/commit/22171e7))


### BREAKING CHANGE

* The path of esbuild or vite config is obtained from base property instead of esbuild property.


## 3.3.0 (2024-10-04)

* chore: add example with React and update README.md ([b0eb9ac](https://github.com/eduardoleolim/electron-esbuild/commit/b0eb9ac))
* chore: bump version to 3.3.0 ([83b8bfd](https://github.com/eduardoleolim/electron-esbuild/commit/83b8bfd))
* chore: rename example scripts ([c2d4a6b](https://github.com/eduardoleolim/electron-esbuild/commit/c2d4a6b))
* chore: update dependencies ([1835a3d](https://github.com/eduardoleolim/electron-esbuild/commit/1835a3d))
* chore: update dependencies of examples ([cedb124](https://github.com/eduardoleolim/electron-esbuild/commit/cedb124))
* chore: update license ([fbf2e69](https://github.com/eduardoleolim/electron-esbuild/commit/fbf2e69))
* feat: download scripts parallelly using defer ([bbb6d38](https://github.com/eduardoleolim/electron-esbuild/commit/bbb6d38))
* fix: cast FSWatcher ([b4052b5](https://github.com/eduardoleolim/electron-esbuild/commit/b4052b5))
* fix: import missing interface ([7a9bcf0](https://github.com/eduardoleolim/electron-esbuild/commit/7a9bcf0))



## 3.2.0 (2024-08-16)

* release: v3.2.0 ([daa56c5](https://github.com/eduardoleolim/electron-esbuild/commit/daa56c5))
* fix(main-dispatcher): finish the tool process after finish all main processes ([cc88306](https://github.com/eduardoleolim/electron-esbuild/commit/cc88306))
* chore: update examples' libraries ([8d60e7d](https://github.com/eduardoleolim/electron-esbuild/commit/8d60e7d))



## 3.1.0 (2024-08-15)

* release: v3.1.0 ([9b1be04](https://github.com/eduardoleolim/electron-esbuild/commit/9b1be04))
* chore: update libraries ([1305a1a](https://github.com/eduardoleolim/electron-esbuild/commit/1305a1a))



## 3.0.0 (2024-04-03)

* release: v3.0.0 ([4bd6ff7](https://github.com/eduardoleolim/electron-esbuild/commit/4bd6ff7))
* chore: update dependencies ([b77f6a5](https://github.com/eduardoleolim/electron-esbuild/commit/b77f6a5))
* chore: update readme ([6b8ba2c](https://github.com/eduardoleolim/electron-esbuild/commit/6b8ba2c))
* chore: update readme ([4c0a4b3](https://github.com/eduardoleolim/electron-esbuild/commit/4c0a4b3))
* chore: update README ([3cfe230](https://github.com/eduardoleolim/electron-esbuild/commit/3cfe230))
* feat: add vite option in command line app ([a1d9d38](https://github.com/eduardoleolim/electron-esbuild/commit/a1d9d38))
* feat: support commnad line arguments for main process ([fd58331](https://github.com/eduardoleolim/electron-esbuild/commit/fd58331))
* feat(renderer): implement builder with vite ([49b30b7](https://github.com/eduardoleolim/electron-esbuild/commit/49b30b7))
* feat(renderer): set htmlEntryPoint as entryPoint when use vite ([488075b](https://github.com/eduardoleolim/electron-esbuild/commit/488075b))
* docs: add electron arguments for development mode ([cdaf866](https://github.com/eduardoleolim/electron-esbuild/commit/cdaf866))
* docs: include flag of vite in config parser ([f70ac22](https://github.com/eduardoleolim/electron-esbuild/commit/f70ac22))


### BREAKING-CHANGE

* Add support for use vite


## 2.8.0 (2024-03-22)

* release: v2.8.0 ([9ca13e4](https://github.com/eduardoleolim/electron-esbuild/commit/9ca13e4))
* refactor: update config classes according new class diagram ([1d9658a](https://github.com/eduardoleolim/electron-esbuild/commit/1d9658a))
* refactor(config): change to public methods of parser ([37cbfe5](https://github.com/eduardoleolim/electron-esbuild/commit/37cbfe5))
* chore: update README ([40f7d4b](https://github.com/eduardoleolim/electron-esbuild/commit/40f7d4b))
* refactor (constructor): reload the renderer process when the preload source changes. ([58c6a70](https://github.com/eduardoleolim/electron-esbuild/commit/58c6a70))
* docs: add direct dependency of PreloadConfig on ElectronConfig ([8640024](https://github.com/eduardoleolim/electron-esbuild/commit/8640024))


### BREAKING CHANGE

* Reload renderer proncess when reload source change in development mode


## <small>2.7.5 (2024-03-14)</small>

* release: v2.7.5 ([8d69ed5](https://github.com/eduardoleolim/electron-esbuild/commit/8d69ed5))
* fix: finish the building task correctly ([f1b955e](https://github.com/eduardoleolim/electron-esbuild/commit/f1b955e))
* chore: rename main process dispatcher ([8659a81](https://github.com/eduardoleolim/electron-esbuild/commit/8659a81))
* docs: update electron-esbuild in examples ([638d248](https://github.com/eduardoleolim/electron-esbuild/commit/638d248))



## <small>2.7.4 (2024-03-12)</small>

* release: v2.7.4 ([fd1873d](https://github.com/eduardoleolim/electron-esbuild/commit/fd1873d))
* docs: add basic examples ([e12b00f](https://github.com/eduardoleolim/electron-esbuild/commit/e12b00f))
* docs: add svelte example ([42c383c](https://github.com/eduardoleolim/electron-esbuild/commit/42c383c))
* fix(renderer): ensure that the html´s dir exists before copying it ([39d2c03](https://github.com/eduardoleolim/electron-esbuild/commit/39d2c03))
* refactor(builder): move main process killer to main process dispatcher ([b96b0d2](https://github.com/eduardoleolim/electron-esbuild/commit/b96b0d2))
* refactor(builder): simplify esbuild-options object ([eddf683](https://github.com/eduardoleolim/electron-esbuild/commit/eddf683))



## <small>2.7.3 (2024-03-08)</small>

* release: v2.7.3 ([fee0881](https://github.com/eduardoleolim/electron-esbuild/commit/fee0881))
* fix(develop): maintain fast reload functionality for the renderer server ([166495e](https://github.com/eduardoleolim/electron-esbuild/commit/166495e))
* feat(develop): implement queue for proper termination of the main process ([ed529af](https://github.com/eduardoleolim/electron-esbuild/commit/ed529af))



## <small>2.7.2 (2024-03-07)</small>

* release: v2.7.2 ([7d912c4](https://github.com/eduardoleolim/electron-esbuild/commit/7d912c4))
* feat: support multiple electron configs again ([7a6ccbb](https://github.com/eduardoleolim/electron-esbuild/commit/7a6ccbb))
* feat(develop): implement new Renderer server ([429f3c0](https://github.com/eduardoleolim/electron-esbuild/commit/429f3c0))
* chore: lint code ([c8f2edd](https://github.com/eduardoleolim/electron-esbuild/commit/c8f2edd))
* chore: update dev dependencies ([a25b239](https://github.com/eduardoleolim/electron-esbuild/commit/a25b239))
* fix(develop): build electron process synchronously ([82192e5](https://github.com/eduardoleolim/electron-esbuild/commit/82192e5))
* refactor(builder): build preloads in build method ([cbf30ae](https://github.com/eduardoleolim/electron-esbuild/commit/cbf30ae))
* refactor(develop): copy resources before call develop service ([a2a143d](https://github.com/eduardoleolim/electron-esbuild/commit/a2a143d))



## <small>2.7.1 (2024-03-05)</small>

* release: v2.7.1 ([3f299a9](https://github.com/eduardoleolim/electron-esbuild/commit/3f299a9))
* fix(builder): set browser platform for renderer process ([82921ab](https://github.com/eduardoleolim/electron-esbuild/commit/82921ab))
* chore: rename esbuild-options variable ([488aabb](https://github.com/eduardoleolim/electron-esbuild/commit/488aabb))
* feat(develop): implement new electron process starter ([d95aa42](https://github.com/eduardoleolim/electron-esbuild/commit/d95aa42))



## 2.7.0 (2024-03-03)

* release: v2.7.0 ([7abe996](https://github.com/eduardoleolim/electron-esbuild/commit/7abe996))
* chore: update esbuil version ([f206e72](https://github.com/eduardoleolim/electron-esbuild/commit/f206e72))
* feat(develop): sort builder in develop task ([0f420fe](https://github.com/eduardoleolim/electron-esbuild/commit/0f420fe))
* feat(renderer): handle exceptions in first build in development task ([e2fb33c](https://github.com/eduardoleolim/electron-esbuild/commit/e2fb33c))



## 2.6.0 (2024-03-02)

* release: v2.6.0 ([951202a](https://github.com/eduardoleolim/electron-esbuild/commit/951202a))
* feat(builder): copy resources ([b0e3d31](https://github.com/eduardoleolim/electron-esbuild/commit/b0e3d31))



## <small>2.5.2 (2024-03-02)</small>

* release: v2.5.2 ([b33eaf9](https://github.com/eduardoleolim/electron-esbuild/commit/b33eaf9))
* feat(builder): handle errors in builders ([d67fc33](https://github.com/eduardoleolim/electron-esbuild/commit/d67fc33))
* fix(config): load esbuild entry from config file ([5955490](https://github.com/eduardoleolim/electron-esbuild/commit/5955490))



## <small>2.5.1 (2024-03-02)</small>

* release: v2.5.1 ([06b1c18](https://github.com/eduardoleolim/electron-esbuild/commit/06b1c18))
* fix: bin path fixed ([b337961](https://github.com/eduardoleolim/electron-esbuild/commit/b337961))



## 2.5.0 (2024-03-02)

* release: v2.5.0 ([9261c3d](https://github.com/eduardoleolim/electron-esbuild/commit/9261c3d))
* fix: add links to script and css files in html ([5abb2de](https://github.com/eduardoleolim/electron-esbuild/commit/5abb2de))
* fix: change variable name ([5f53698](https://github.com/eduardoleolim/electron-esbuild/commit/5f53698))
* fix: load preloads, renderers and loaders configs ([70cd65e](https://github.com/eduardoleolim/electron-esbuild/commit/70cd65e))
* fix: use process.cwd() and await in build ([d721e2a](https://github.com/eduardoleolim/electron-esbuild/commit/d721e2a))
* docs: change plantuml for staruml editor ([fbef532](https://github.com/eduardoleolim/electron-esbuild/commit/fbef532))
* docs: export uml diagrams to jpg ([51c43ca](https://github.com/eduardoleolim/electron-esbuild/commit/51c43ca))
* docs: multiple renderer configs ([6ae855c](https://github.com/eduardoleolim/electron-esbuild/commit/6ae855c))
* docs: specify use cases diagram ([401121f](https://github.com/eduardoleolim/electron-esbuild/commit/401121f))
* docs: update readme ([726869f](https://github.com/eduardoleolim/electron-esbuild/commit/726869f))
* docs: use cases and class diagram in staruml ([c914d37](https://github.com/eduardoleolim/electron-esbuild/commit/c914d37))
* feat: build main electron process ([2888311](https://github.com/eduardoleolim/electron-esbuild/commit/2888311))
* feat: build preload process ([19f0c58](https://github.com/eduardoleolim/electron-esbuild/commit/19f0c58))
* feat: build renderer process ([48109c9](https://github.com/eduardoleolim/electron-esbuild/commit/48109c9))
* feat: debounce 500 millis rebuild function ([d98e73b](https://github.com/eduardoleolim/electron-esbuild/commit/d98e73b))
* feat: implement http server with proxy ([623a537](https://github.com/eduardoleolim/electron-esbuild/commit/623a537))
* feat: import with file url in win32 platform ([2525b2d](https://github.com/eduardoleolim/electron-esbuild/commit/2525b2d))
* feat: rebuild renderer process and reload browser automatically ([15be49e](https://github.com/eduardoleolim/electron-esbuild/commit/15be49e))
* feat: rebuilt preloads in development ([bf75e5d](https://github.com/eduardoleolim/electron-esbuild/commit/bf75e5d))
* feat(config-parser): improve parser ([8b351bb](https://github.com/eduardoleolim/electron-esbuild/commit/8b351bb))
* test: fix jest config for .mjs extension ([8211ae7](https://github.com/eduardoleolim/electron-esbuild/commit/8211ae7))
* test: update test of OutputConfig ([810a72e](https://github.com/eduardoleolim/electron-esbuild/commit/810a72e))
* refactor: change to module ([0a549e7](https://github.com/eduardoleolim/electron-esbuild/commit/0a549e7))
* refactor: implement config classes according class diagram ([e1a8f46](https://github.com/eduardoleolim/electron-esbuild/commit/e1a8f46))
* refactor: load esbuild BuildOptions instead an array of plugins ([e45c6c3](https://github.com/eduardoleolim/electron-esbuild/commit/e45c6c3))
* refactor: reimplement parser for yaml and json formats ([e463ba4](https://github.com/eduardoleolim/electron-esbuild/commit/e463ba4))
* refactor: separe services in build and develop services ([ef7a6e8](https://github.com/eduardoleolim/electron-esbuild/commit/ef7a6e8))
* refactor(develop): build main process and start electron process for development ([ca2fb39](https://github.com/eduardoleolim/electron-esbuild/commit/ca2fb39))
* build: change to commonjs ([624cceb](https://github.com/eduardoleolim/electron-esbuild/commit/624cceb))
* ci: execute pipeline in specific conditions ([0180c74](https://github.com/eduardoleolim/electron-esbuild/commit/0180c74))
* ci: execute pipeline when specific files change ([72908a3](https://github.com/eduardoleolim/electron-esbuild/commit/72908a3))
* ci: fix conditions for pipeline execution ([b111dbd](https://github.com/eduardoleolim/electron-esbuild/commit/b111dbd))
* chore: rename app folder ([bb773f7](https://github.com/eduardoleolim/electron-esbuild/commit/bb773f7))



## 2.4.0 (2023-09-26)

* release: v2.4.0 ([999f18e](https://github.com/eduardoleolim/electron-esbuild/commit/999f18e))
* chore(esbuild): support for esbuild 0.19.x ([c5c8658](https://github.com/eduardoleolim/electron-esbuild/commit/c5c8658))



## 2.3.0 (2023-07-30)

* release: v2.3.0 ([660c336](https://github.com/eduardoleolim/electron-esbuild/commit/660c336))
* feat(preload): add reload option in preload config ([c3b1aeb](https://github.com/eduardoleolim/electron-esbuild/commit/c3b1aeb))



## <small>2.2.1 (2023-07-29)</small>

* release: v2.2.1 ([f53158d](https://github.com/eduardoleolim/electron-esbuild/commit/f53158d))
* fix(preload): include loader and external property in esbuild's preload config ([4e2c17a](https://github.com/eduardoleolim/electron-esbuild/commit/4e2c17a))
* chore: update CHANGELOG.md ([dd33985](https://github.com/eduardoleolim/electron-esbuild/commit/dd33985))



## 2.2.0 (2023-07-29)

* release: v2.2.0 ([38cb313](https://github.com/eduardoleolim/electron-esbuild/commit/38cb313))
* chore: update readme ([3f0e043](https://github.com/eduardoleolim/electron-esbuild/commit/3f0e043))
* feat(preload): add support for exclude and loaders options in preload config ([985cb6c](https://github.com/eduardoleolim/electron-esbuild/commit/985cb6c))



## 2.1.0 (2023-07-26)

* release: v2.1.0 ([1bcf90d](https://github.com/eduardoleolim/electron-esbuild/commit/1bcf90d))
* chore: add .gitattributes ([24d9f4c](https://github.com/eduardoleolim/electron-esbuild/commit/24d9f4c))
* chore: add CHANGELOG.md ([8bf2081](https://github.com/eduardoleolim/electron-esbuild/commit/8bf2081))
* chore: update readme ([1534247](https://github.com/eduardoleolim/electron-esbuild/commit/1534247))
* refactor: change output message of loading of plugins in renderer builder ([8bb704b](https://github.com/eduardoleolim/electron-esbuild/commit/8bb704b))
* feat(config): include esbuild plugins to main, renderer and preload config ([1118a6a](https://github.com/eduardoleolim/electron-esbuild/commit/1118a6a))



## 2.0.0 (2023-07-23)

* release: v2.0.0 ([05136fe](https://github.com/eduardoleolim/electron-esbuild/commit/05136fe))
* ci: rename workflow ([ba6752c](https://github.com/eduardoleolim/electron-esbuild/commit/ba6752c))
* ci: rename workflow ([8902e37](https://github.com/eduardoleolim/electron-esbuild/commit/8902e37))
* style: order imports ([fb6f974](https://github.com/eduardoleolim/electron-esbuild/commit/fb6f974))
* build: change to ES Module ([842ec64](https://github.com/eduardoleolim/electron-esbuild/commit/842ec64))


### BREAKING CHANGE

* Migration to ES Module
Refs: c8cc138


## <small>1.8.1 (2023-07-23)</small>

* release: v1.8.1 ([7d2e5bf](https://github.com/eduardoleolim/electron-esbuild/commit/7d2e5bf))
* fix: try next port ([e683c23](https://github.com/eduardoleolim/electron-esbuild/commit/e683c23))



## 1.8.0 (2023-07-23)

* release: v1.8.0 ([66f6f5c](https://github.com/eduardoleolim/electron-esbuild/commit/66f6f5c))
* fix: avoid using the same port in different esbuild and livereload servers ([25eaa29](https://github.com/eduardoleolim/electron-esbuild/commit/25eaa29))
* feat: asynchronous construction ([e9c11e9](https://github.com/eduardoleolim/electron-esbuild/commit/e9c11e9))



## 1.7.0 (2023-07-23)

* release: v1.7.0 ([fae87c4](https://github.com/eduardoleolim/electron-esbuild/commit/fae87c4))
* feat: console logger ([0af4e3d](https://github.com/eduardoleolim/electron-esbuild/commit/0af4e3d))
* feat: debounce server reload function ([a577d04](https://github.com/eduardoleolim/electron-esbuild/commit/a577d04))



## 1.6.0 (2023-07-23)

* release: v1.6.0 ([0da2907](https://github.com/eduardoleolim/electron-esbuild/commit/0da2907))
* revert: "refactor(esbuild-dev): remove unnecessary livereload server" ([52a569c](https://github.com/eduardoleolim/electron-esbuild/commit/52a569c))
* build: remove unused dependencies ([31c2882](https://github.com/eduardoleolim/electron-esbuild/commit/31c2882))



## <small>1.5.1 (2023-07-23)</small>

* release: v1.5.1 ([7623272](https://github.com/eduardoleolim/electron-esbuild/commit/7623272))
* fix(hot-reload): avoid remove link of css on reload ([87edd9e](https://github.com/eduardoleolim/electron-esbuild/commit/87edd9e))
* build(eslint): format script folder ([21ee27a](https://github.com/eduardoleolim/electron-esbuild/commit/21ee27a))



## 1.5.0 (2023-07-23)

* release: v1.5.0 ([323ef55](https://github.com/eduardoleolim/electron-esbuild/commit/323ef55))
* refactor(esbuild-dev): remove unnecessary livereload server ([4dbd146](https://github.com/eduardoleolim/electron-esbuild/commit/4dbd146))



## 1.4.0 (2023-07-23)

* release: v1.4.0 ([250a3e7](https://github.com/eduardoleolim/electron-esbuild/commit/250a3e7))
* docs: style readme ([5d6e745](https://github.com/eduardoleolim/electron-esbuild/commit/5d6e745))
* docs: update readme ([0093bad](https://github.com/eduardoleolim/electron-esbuild/commit/0093bad))
* feat: decouple parse of config ([4889152](https://github.com/eduardoleolim/electron-esbuild/commit/4889152))
* feat: support yaml config file ([63a4406](https://github.com/eduardoleolim/electron-esbuild/commit/63a4406))
* feat(command-line): support yaml config file ([3f929a4](https://github.com/eduardoleolim/electron-esbuild/commit/3f929a4))
* refactor: rename extra-files config class ([c76ef57](https://github.com/eduardoleolim/electron-esbuild/commit/c76ef57))
* refactor(config): rename static methods ([e69a3c4](https://github.com/eduardoleolim/electron-esbuild/commit/e69a3c4))
* test: update test of config ([5716a3f](https://github.com/eduardoleolim/electron-esbuild/commit/5716a3f))



## 1.3.0 (2023-07-23)

* release: v1.3.0 ([3bbac57](https://github.com/eduardoleolim/electron-esbuild/commit/3bbac57))
* docs(readme): copy static files ([32c58ed](https://github.com/eduardoleolim/electron-esbuild/commit/32c58ed))
* feat: copy static files ([4fdd7b5](https://github.com/eduardoleolim/electron-esbuild/commit/4fdd7b5))
* refactor(preload): build inline sourceMap ([254bf66](https://github.com/eduardoleolim/electron-esbuild/commit/254bf66))



## 1.2.0 (2023-07-23)

* release: v1.2.0 ([29a2909](https://github.com/eduardoleolim/electron-esbuild/commit/29a2909))
* revert(environment): use process.env ([e2b1e05](https://github.com/eduardoleolim/electron-esbuild/commit/e2b1e05))
* feat(esbuild-dev): generate sourceMap ([f9f966d](https://github.com/eduardoleolim/electron-esbuild/commit/f9f966d))



## <small>1.1.1 (2023-07-23)</small>

* release: v1.1.1 ([011d518](https://github.com/eduardoleolim/electron-esbuild/commit/011d518))
* fix: replace process.env.NODE_ENV in bundle ([3a94c02](https://github.com/eduardoleolim/electron-esbuild/commit/3a94c02))



## 1.1.0 (2023-07-23)

* release: v1.1.0 ([7afcd8b](https://github.com/eduardoleolim/electron-esbuild/commit/7afcd8b))
* feat(builder): add tag for css in html file, if it exists ([c55fe2f](https://github.com/eduardoleolim/electron-esbuild/commit/c55fe2f))
* refactor(esbuild-dev): init sequentially dev-server of renderer process ([7b83fb3](https://github.com/eduardoleolim/electron-esbuild/commit/7b83fb3))
* ci: prevent npm publish if there is not a new release ([6d81fb4](https://github.com/eduardoleolim/electron-esbuild/commit/6d81fb4))
* fix(preload): exclude electron from esbuild config ([a6bf147](https://github.com/eduardoleolim/electron-esbuild/commit/a6bf147))



## 1.0.0 (2023-07-23)

* release: v1.0.0 ([96b196c](https://github.com/eduardoleolim/electron-esbuild/commit/96b196c))
* ci: build and test action ([9ca7f07](https://github.com/eduardoleolim/electron-esbuild/commit/9ca7f07))
* ci: update version of release action ([bcdcfa6](https://github.com/eduardoleolim/electron-esbuild/commit/bcdcfa6))
* ci(release): make release if version in package.json changes ([b32ace2](https://github.com/eduardoleolim/electron-esbuild/commit/b32ace2))
* ci(test): move script to workflows ([930cd6b](https://github.com/eduardoleolim/electron-esbuild/commit/930cd6b))
* test: tsconfig for test ([e75b0a3](https://github.com/eduardoleolim/electron-esbuild/commit/e75b0a3))
* test(enviroment): prepare jest ([1a70740](https://github.com/eduardoleolim/electron-esbuild/commit/1a70740))
* test(output-config): support path win32 or linux ([3d9e4eb](https://github.com/eduardoleolim/electron-esbuild/commit/3d9e4eb))
* test(output-config): test fromJson() ([d4de969](https://github.com/eduardoleolim/electron-esbuild/commit/d4de969))
* docs: readme ([455cbab](https://github.com/eduardoleolim/electron-esbuild/commit/455cbab))
* docs(readme): instructions of usage ([64e3534](https://github.com/eduardoleolim/electron-esbuild/commit/64e3534))
* feat: use a base directory and clean it before building ([d50be4c](https://github.com/eduardoleolim/electron-esbuild/commit/d50be4c))
* feat(builder): add builder for renderer process ([c220566](https://github.com/eduardoleolim/electron-esbuild/commit/c220566))
* feat(builder): add script of renderer in html ([9ae55e3](https://github.com/eduardoleolim/electron-esbuild/commit/9ae55e3))
* feat(builder): build application for production ([8fcce7f](https://github.com/eduardoleolim/electron-esbuild/commit/8fcce7f))
* feat(builder): service for development ([65dd700](https://github.com/eduardoleolim/electron-esbuild/commit/65dd700))
* feat(cli): support dev and build commands by cli ([66f24ad](https://github.com/eduardoleolim/electron-esbuild/commit/66f24ad))
* feat(command-line): add flag to clean output directory ([a165851](https://github.com/eduardoleolim/electron-esbuild/commit/a165851))
* feat(config): define model of electron-esbuild configuration ([a5a0715](https://github.com/eduardoleolim/electron-esbuild/commit/a5a0715))
* feat(config): support exclude option for main and renderer config ([a37a038](https://github.com/eduardoleolim/electron-esbuild/commit/a37a038))
* feat(config): support of dev port for renderer config ([5bfdf82](https://github.com/eduardoleolim/electron-esbuild/commit/5bfdf82))
* feat(esbuild-dev): electron-esbuild service for development main process ([1f9e263](https://github.com/eduardoleolim/electron-esbuild/commit/1f9e263))
* refactor(builder): decouple esbuild loaders from builders ([4462ae7](https://github.com/eduardoleolim/electron-esbuild/commit/4462ae7))
* fix(preload): make correct output path of preload ([d79d088](https://github.com/eduardoleolim/electron-esbuild/commit/d79d088))
* build: configure project ([2fbb48f](https://github.com/eduardoleolim/electron-esbuild/commit/2fbb48f))
* build: fix config of eslint with prettier ([2b81117](https://github.com/eduardoleolim/electron-esbuild/commit/2b81117))
* build: structure project with port-adapter pattern ([4f483e1](https://github.com/eduardoleolim/electron-esbuild/commit/4f483e1))
* build(pack): just include dist folder in package ([155623b](https://github.com/eduardoleolim/electron-esbuild/commit/155623b))
* project created ([482df9a](https://github.com/eduardoleolim/electron-esbuild/commit/482df9a))



