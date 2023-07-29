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

