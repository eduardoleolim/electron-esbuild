## [3.3.0](https://github.com/eduardoleolim/electron-esbuild/compare/3.2.0...3.3.0) (2024-10-04)

### Features

* download scripts parallelly using defer ([bbb6d38](https://github.com/eduardoleolim/electron-esbuild/commit/bbb6d38a61f117f0f89381594a32e05e5461d86f))

### Bug Fixes

* cast FSWatcher ([b4052b5](https://github.com/eduardoleolim/electron-esbuild/commit/b4052b5a0d50888046c8f2cdc67738edb332e99d))
* import missing interface ([7a9bcf0](https://github.com/eduardoleolim/electron-esbuild/commit/7a9bcf0805dd364a8d8059ccd90c435b8595ff47))
## [3.2.0](https://github.com/eduardoleolim/electron-esbuild/compare/3.1.0...3.2.0) (2024-08-16)

### Bug Fixes

* **main-dispatcher:** finish the tool process after finish all main processes ([cc88306](https://github.com/eduardoleolim/electron-esbuild/commit/cc88306ca858962835d603c458d95d5c06ec4017))
## [3.1.0](https://github.com/eduardoleolim/electron-esbuild/compare/3.0.0...3.1.0) (2024-08-15)
## [3.0.0](https://github.com/eduardoleolim/electron-esbuild/compare/2.8.0...3.0.0) (2024-04-03)

### ⚠ BREAKING CHANGES

* **renderer:** Add support for use vite

### Features

* add vite option in command line app ([a1d9d38](https://github.com/eduardoleolim/electron-esbuild/commit/a1d9d382a0b59af61b9bdec6b231861deac69df5))
* **renderer:** implement builder with vite ([49b30b7](https://github.com/eduardoleolim/electron-esbuild/commit/49b30b7a031c5bbe8d942508376a5ba2fd7dd70b))
* **renderer:** set htmlEntryPoint as entryPoint when use vite ([488075b](https://github.com/eduardoleolim/electron-esbuild/commit/488075b54a3f408b87221083949d2a7ff99ea457))
* support commnad line arguments for main process ([fd58331](https://github.com/eduardoleolim/electron-esbuild/commit/fd58331fbe7a3a5e7aa5311704bc3e1ad9d4f9ba))
## [2.8.0](https://github.com/eduardoleolim/electron-esbuild/compare/2.7.5...2.8.0) (2024-03-22)

### ⚠ BREAKING CHANGES

* Reload renderer proncess when reload source change in development mode

### release

* v2.8.0 ([9ca13e4](https://github.com/eduardoleolim/electron-esbuild/commit/9ca13e4988d1dbf20a84861edb60d08109538d3a))
## [2.7.5](https://github.com/eduardoleolim/electron-esbuild/compare/2.7.4...2.7.5) (2024-03-14)

### Bug Fixes

* finish the building task correctly ([f1b955e](https://github.com/eduardoleolim/electron-esbuild/commit/f1b955e9982ba6767bb39301eba0df9efa7f09f6))
## [2.7.4](https://github.com/eduardoleolim/electron-esbuild/compare/2.7.3...2.7.4) (2024-03-12)

### Bug Fixes

* **renderer:** ensure that the html´s dir exists before copying it ([39d2c03](https://github.com/eduardoleolim/electron-esbuild/commit/39d2c03c10b81f547249b3591de0711ab4658600))
## [2.7.3](https://github.com/eduardoleolim/electron-esbuild/compare/2.7.2...2.7.3) (2024-03-08)

### Features

* **develop:** implement queue for proper termination of the main process ([ed529af](https://github.com/eduardoleolim/electron-esbuild/commit/ed529af66225372b0d721c2f884c0d07a7711aee))

### Bug Fixes

* **develop:** maintain fast reload functionality for the renderer server ([166495e](https://github.com/eduardoleolim/electron-esbuild/commit/166495e1f47609b6f0a122c5b68dac549716f212))
## [2.7.2](https://github.com/eduardoleolim/electron-esbuild/compare/2.7.1...2.7.2) (2024-03-07)

### Features

* **develop:** implement new Renderer server ([429f3c0](https://github.com/eduardoleolim/electron-esbuild/commit/429f3c0f0c1b5e1917bfd0b83c3fd0182a5b99e1))
* support multiple electron configs again ([7a6ccbb](https://github.com/eduardoleolim/electron-esbuild/commit/7a6ccbb977749af2f80791e1bccac130745d0772))

### Bug Fixes

* **develop:** build electron process synchronously ([82192e5](https://github.com/eduardoleolim/electron-esbuild/commit/82192e571c4deac07f628fe1cc0aba6322e4208b))
## [2.7.1](https://github.com/eduardoleolim/electron-esbuild/compare/2.7.0...2.7.1) (2024-03-05)

### Features

* **develop:** implement new electron process starter ([d95aa42](https://github.com/eduardoleolim/electron-esbuild/commit/d95aa42f6734d88ed51fcfdf5d5468f5a7518c80))

### Bug Fixes

* **builder:** set browser platform for renderer process ([82921ab](https://github.com/eduardoleolim/electron-esbuild/commit/82921abd42d87b4ae43bbd02afd8b00fe9bdc901))
## [2.7.0](https://github.com/eduardoleolim/electron-esbuild/compare/2.6.0...2.7.0) (2024-03-03)

### Features

* **develop:** sort builder in develop task ([0f420fe](https://github.com/eduardoleolim/electron-esbuild/commit/0f420fe907b98e4a0c3a60a78438b910a99236fc))
* **renderer:** handle exceptions in first build in development task ([e2fb33c](https://github.com/eduardoleolim/electron-esbuild/commit/e2fb33c4e5fa0ad4cd2b420dfea3a6e904ab0c9d))
## [2.6.0](https://github.com/eduardoleolim/electron-esbuild/compare/2.5.2...2.6.0) (2024-03-02)

### Features

* **builder:** copy resources ([b0e3d31](https://github.com/eduardoleolim/electron-esbuild/commit/b0e3d3170362eeb6a61c216c7395f5b0c9a9e408))
## [2.5.2](https://github.com/eduardoleolim/electron-esbuild/compare/2.5.1...2.5.2) (2024-03-02)

### Features

* **builder:** handle errors in builders ([d67fc33](https://github.com/eduardoleolim/electron-esbuild/commit/d67fc33ecf3d36ddfa510b75a47445da48fde42d))

### Bug Fixes

* **config:** load esbuild entry from config file ([5955490](https://github.com/eduardoleolim/electron-esbuild/commit/5955490f67fe775bf0f0acb38311302fd4d8b550))
## [2.5.1](https://github.com/eduardoleolim/electron-esbuild/compare/2.5.0...2.5.1) (2024-03-02)

### Bug Fixes

* bin path fixed ([b337961](https://github.com/eduardoleolim/electron-esbuild/commit/b337961c91be7dd2dc41f13bfea07ad50fde6b75))
## [2.5.0](https://github.com/eduardoleolim/electron-esbuild/compare/2.4.0...2.5.0) (2024-03-02)

### Features

* build main electron process ([2888311](https://github.com/eduardoleolim/electron-esbuild/commit/2888311f7535fbf1d39c9f9917bedd53d6e6335f))
* build preload process ([19f0c58](https://github.com/eduardoleolim/electron-esbuild/commit/19f0c58cd35dcc76594c2e635d607d0c199ce650))
* build renderer process ([48109c9](https://github.com/eduardoleolim/electron-esbuild/commit/48109c947129d0ac2af650d3dac2611f664793e1))
* **config-parser:** improve parser ([8b351bb](https://github.com/eduardoleolim/electron-esbuild/commit/8b351bb9aadfcc208c67c8027792ad6813903535))
* debounce 500 millis rebuild function ([d98e73b](https://github.com/eduardoleolim/electron-esbuild/commit/d98e73b2c326b41c11ed3e9c5b4ddc373d23e2c8))
* implement http server with proxy ([623a537](https://github.com/eduardoleolim/electron-esbuild/commit/623a537c5d1a2a743a36828fe09a913aa5ec1def))
* import with file url in win32 platform ([2525b2d](https://github.com/eduardoleolim/electron-esbuild/commit/2525b2ddf43a0d97552d7c1f0105019ea281b89d))
* rebuild renderer process and reload browser automatically ([15be49e](https://github.com/eduardoleolim/electron-esbuild/commit/15be49ea05cfa27b7a163c9864b1f706914d5487))
* rebuilt preloads in development ([bf75e5d](https://github.com/eduardoleolim/electron-esbuild/commit/bf75e5df547dad7c188f4b70d1b5646db11f4d57))

### Bug Fixes

* add links to script and css files in html ([5abb2de](https://github.com/eduardoleolim/electron-esbuild/commit/5abb2dee87d5306501450616186389c0efaffc5c))
* change variable name ([5f53698](https://github.com/eduardoleolim/electron-esbuild/commit/5f53698a84bdfa04b0d208be9c6a5a2f08705556))
* load preloads, renderers and loaders configs ([70cd65e](https://github.com/eduardoleolim/electron-esbuild/commit/70cd65e346e7e727a179cf6b4cd05e9debc88a29))
* use process.cwd() and await in build ([d721e2a](https://github.com/eduardoleolim/electron-esbuild/commit/d721e2a3dd59b9b26f393c80bb861dd5af9153a6))
## [2.4.0](https://github.com/eduardoleolim/electron-esbuild/compare/2.3.0...2.4.0) (2023-09-26)
## [2.3.0](https://github.com/eduardoleolim/electron-esbuild/compare/2.2.1...2.3.0) (2023-07-30)

### Features

* **preload:** add reload option in preload config ([c3b1aeb](https://github.com/eduardoleolim/electron-esbuild/commit/c3b1aebfb1131a3d8c693579bb7c87c2bd4409fa))
## [2.2.1](https://github.com/eduardoleolim/electron-esbuild/compare/2.2.0...2.2.1) (2023-07-29)

### Bug Fixes

* **preload:** include loader and external property in esbuild's preload config ([4e2c17a](https://github.com/eduardoleolim/electron-esbuild/commit/4e2c17a4cbd17f5a8e472dd61bba360abfb76c68))
## [2.2.0](https://github.com/eduardoleolim/electron-esbuild/compare/2.1.0...2.2.0) (2023-07-29)

### Features

* **preload:** add support for exclude and loaders options in preload config ([985cb6c](https://github.com/eduardoleolim/electron-esbuild/commit/985cb6ca800df291d8829ba98ff0120899ed3465))
## [2.1.0](https://github.com/eduardoleolim/electron-esbuild/compare/2.0.0...2.1.0) (2023-07-26)

### Features

* **config:** include esbuild plugins to main, renderer and preload config ([1118a6a](https://github.com/eduardoleolim/electron-esbuild/commit/1118a6a44c8dc93712790ee97295ecfc0146a776))
## [2.0.0](https://github.com/eduardoleolim/electron-esbuild/compare/1.8.1...2.0.0) (2023-07-23)

### ⚠ BREAKING CHANGES

* Migration to ES Module
Refs: c8cc138

### release

* v2.0.0 ([05136fe](https://github.com/eduardoleolim/electron-esbuild/commit/05136fe1d2952c43a047fbcfd00ed4b5e168029f))
## [1.8.1](https://github.com/eduardoleolim/electron-esbuild/compare/1.8.0...1.8.1) (2023-07-23)

### Bug Fixes

* try next port ([e683c23](https://github.com/eduardoleolim/electron-esbuild/commit/e683c23368315f33f09c6dffb58f02e068cd53a3))
## [1.8.0](https://github.com/eduardoleolim/electron-esbuild/compare/1.7.0...1.8.0) (2023-07-23)

### Features

* asynchronous construction ([e9c11e9](https://github.com/eduardoleolim/electron-esbuild/commit/e9c11e954e56ad1f7e0f84176a9d9b0693f44e6b))

### Bug Fixes

* avoid using the same port in different esbuild and livereload servers ([25eaa29](https://github.com/eduardoleolim/electron-esbuild/commit/25eaa299e5e8f4bafea7e94eaccefa0c7f61cb95))
## [1.7.0](https://github.com/eduardoleolim/electron-esbuild/compare/1.6.0...1.7.0) (2023-07-23)

### Features

* console logger ([0af4e3d](https://github.com/eduardoleolim/electron-esbuild/commit/0af4e3da580d91506fb1cb1bb12a826964ebd8bb))
* debounce server reload function ([a577d04](https://github.com/eduardoleolim/electron-esbuild/commit/a577d042e7b5c385735eff08439154a24bce37ab))
## [1.6.0](https://github.com/eduardoleolim/electron-esbuild/compare/1.5.1...1.6.0) (2023-07-23)

### Reverts

* "refactor(esbuild-dev): remove unnecessary livereload server" ([52a569c](https://github.com/eduardoleolim/electron-esbuild/commit/52a569ca6a08fcb5a6defd07ecd3c4672686c5a2))
## [1.5.1](https://github.com/eduardoleolim/electron-esbuild/compare/1.5.0...1.5.1) (2023-07-23)

### Bug Fixes

* **hot-reload:** avoid remove link of css on reload ([87edd9e](https://github.com/eduardoleolim/electron-esbuild/commit/87edd9e6746ea0df4e7224e38d229ef3fded3149))
## [1.5.0](https://github.com/eduardoleolim/electron-esbuild/compare/1.4.0...1.5.0) (2023-07-23)
## [1.4.0](https://github.com/eduardoleolim/electron-esbuild/compare/1.3.0...1.4.0) (2023-07-23)

### Features

* **command-line:** support yaml config file ([3f929a4](https://github.com/eduardoleolim/electron-esbuild/commit/3f929a4484e1dbc547c5ce15411d99e14798cb7a))
* decouple parse of config ([4889152](https://github.com/eduardoleolim/electron-esbuild/commit/4889152ccccd49c2079f2f8b090ce3805d8b7896))
* support yaml config file ([63a4406](https://github.com/eduardoleolim/electron-esbuild/commit/63a4406bd48afc6eed649c09b37ddf2f583d3f4d))
## [1.3.0](https://github.com/eduardoleolim/electron-esbuild/compare/1.2.0...1.3.0) (2023-07-23)

### Features

* copy static files ([4fdd7b5](https://github.com/eduardoleolim/electron-esbuild/commit/4fdd7b5bc611c7cb9a8c007164abb1bc2e5dbdc5))
## [1.2.0](https://github.com/eduardoleolim/electron-esbuild/compare/1.1.1...1.2.0) (2023-07-23)

### Features

* **esbuild-dev:** generate sourceMap ([f9f966d](https://github.com/eduardoleolim/electron-esbuild/commit/f9f966d4bb34aa8efbe0dadf9b754ff80e29d559))

### Reverts

* **environment:** use process.env ([e2b1e05](https://github.com/eduardoleolim/electron-esbuild/commit/e2b1e05202b8b72b67124261bf4ef746d5124922))
## [1.1.1](https://github.com/eduardoleolim/electron-esbuild/compare/1.1.0...1.1.1) (2023-07-23)

### Bug Fixes

* replace process.env.NODE_ENV in bundle ([3a94c02](https://github.com/eduardoleolim/electron-esbuild/commit/3a94c0232b1b770d06ad9227bd6ce16aacfcdc20))
## [1.1.0](https://github.com/eduardoleolim/electron-esbuild/compare/1.0.0...1.1.0) (2023-07-23)

### Features

* **builder:** add tag for css in html file, if it exists ([c55fe2f](https://github.com/eduardoleolim/electron-esbuild/commit/c55fe2fc6720ddecaaa66fa584af02df6d0ef910))

### Bug Fixes

* **preload:** exclude electron from esbuild config ([a6bf147](https://github.com/eduardoleolim/electron-esbuild/commit/a6bf147c88b0eedb7270b3e14eeb2d53c71bae76))
## [1.0.0](https://github.com/eduardoleolim/electron-esbuild/compare/a5a0715e95160eb82b1beddd10d677fc0e7fb4c3...1.0.0) (2023-07-23)

### Features

* **builder:** add builder for renderer process ([c220566](https://github.com/eduardoleolim/electron-esbuild/commit/c220566e2c246b1a118ab93cc82eec4db7e0ae9e))
* **builder:** add script of renderer in html ([9ae55e3](https://github.com/eduardoleolim/electron-esbuild/commit/9ae55e36d938588b6f7c9c1a29e772c213299d18))
* **builder:** build application for production ([8fcce7f](https://github.com/eduardoleolim/electron-esbuild/commit/8fcce7f874ad2ff588236d226d1bbbb80aa11346))
* **builder:** service for development ([65dd700](https://github.com/eduardoleolim/electron-esbuild/commit/65dd700c28addda52171f14a516bab28bf7e3626))
* **cli:** support dev and build commands by cli ([66f24ad](https://github.com/eduardoleolim/electron-esbuild/commit/66f24adf96d93d353f82a93850d8259f72250941))
* **command-line:** add flag to clean output directory ([a165851](https://github.com/eduardoleolim/electron-esbuild/commit/a1658511597dae98bcd6b3653fb9c92a10a14451))
* **config:** define model of electron-esbuild configuration ([a5a0715](https://github.com/eduardoleolim/electron-esbuild/commit/a5a0715e95160eb82b1beddd10d677fc0e7fb4c3))
* **config:** support exclude option for main and renderer config ([a37a038](https://github.com/eduardoleolim/electron-esbuild/commit/a37a0381f1b42215f75d0bf4f85ae25b54f065b7))
* **config:** support of dev port for renderer config ([5bfdf82](https://github.com/eduardoleolim/electron-esbuild/commit/5bfdf82c33e5651e2459438f13b7cafd1e9cab14))
* **esbuild-dev:** electron-esbuild service for development main process ([1f9e263](https://github.com/eduardoleolim/electron-esbuild/commit/1f9e263d2ff143850f5169fc3420233e2e5c321e))
* use a base directory and clean it before building ([d50be4c](https://github.com/eduardoleolim/electron-esbuild/commit/d50be4c36b330c5be08a65fdebce2e8d31fa8605))

### Bug Fixes

* **preload:** make correct output path of preload ([d79d088](https://github.com/eduardoleolim/electron-esbuild/commit/d79d0889df33cdf76ac5ced65628ae6697d22dac))
