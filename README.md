<h1 align="center">
  <img src="https://upload.wikimedia.org/wikipedia/commons/9/91/Electron_Software_Framework_Logo.svg" height="35" alt="electron logo">
  electron-esbuild
  <img src="https://raw.githubusercontent.com/evanw/esbuild/a846a60af6bf679e158e486b9da82dcf270fc613/images/logo.svg" height="35" alt="esbuild logo">
</h1>

<p align="center">
    <a href="https://github.com/eduardoleolim/electron-esbuild/actions/workflows/publish.yaml"><img src="https://github.com/eduardoleolim/electron-esbuild/actions/workflows/publish.yaml/badge.svg" alt="Build status"/></a>
    <a href="https://www.npmjs.com/package/@eduardoleolim/electron-esbuild"><img src="https://img.shields.io/npm/v/@eduardoleolim/electron-esbuild" alt="NPM version"/></a>
    <a href="https://www.npmjs.com/package/@eduardoleolim/electron-esbuild"><img src="https://img.shields.io/npm/dt/@eduardoleolim/electron-esbuild" alt="NPM downloads"/></a>
    <a href="https://github.com/eduardoleolim/electron-esbuild/blob/master/LICENSE"><img src="https://img.shields.io/npm/l/@eduardoleolim/electron-esbuild" alt="License"/></a>
</p>

<p align="center">
  <a href="https://github.com/eduardoleolim/electron-esbuild/stargazers">Stars are welcome 😊</a>
</p>

Inspired by [electron-esbuild](https://github.com/Kiyozz/electron-esbuild) of [Kiyozz](https://github.com/Kiyozz).

A package to build your electron app with esbuild.

## ✨ Features

- Build your electron app with esbuild
- Start a dev server for your renderer process
- Hot reload for dev server
- Copy extra files to the output directory
- Support for preload files
- Support for esbuild loaders
- Support for exclude libs
- Support for multiple main, preload and renderer configurations

## 📥 Installation

```bash
npm install @eduardoleolim/electron-esbuild --save-dev
```

## 🖥️ Usage

```bash
npx electron-esbuild <command> [options]
```

### ⌨️ Commands

#### 🛠️ build

Builds your electron app.

Options:

- `--config or -c` Config file path.

```bash
npx electron-esbuild build [--config electron-esbuild.config.json]
```

#### 👨‍💻 dev

Builds your electron app and starts a dev server for your renderer process.

Options:

- `--config or -c` Config file path.
- `--clean` Clean the output directory before building. Default: `false`

```bash
npx electron-esbuild dev [--config electron-esbuild.config.json] [--clean]
```

## ⚙️ Configuration

You can configure the build with a json or yaml file in the root of your project. It looking for a config file named `electron-esbuild.config.json` or `electron-esbuild.config.yaml`.

Electron-esbuild will look for the config file in the following order:

- The path specified in the `--config` option
- The default yaml file
- The default json file

### Electron Config

The electron config has the following properties:

- `output` - Optional. The output directory of your electron app, default: `dist`. It is relative to the root of your project
- `main` - The main process config
- `renderers` - Optional. The renderer process config can be an array of configs or a single config
- `resources` - Optional. An array of files to copy to the output directory

```json5
{
  "output": "<rootProjectDir>/<outputDir>",
  "main": {
    ...
  },
  "renderers": [
    ...
  ],
  "resources": [
    ...
  ]
}
```

### Main Config

The main config has the following properties:

- `entry` - The entry file of your main process
- `output` - The output configuration of bundle
  - `directory` - The output directory of your main process. It is relative to the `output` property of ElectronConfig
  - `filename` - The output filename of your main process
- `esbuild` - Optional. Path to a javascript file exporting esbuild options
- `preloads` - Optional. A preload config can be an array of configs or a single config
- `exclude` - Optional. An array of libs that you don't want to bundle
- `loaders` - Optional. An array of esbuild's loaders for specific files

```json5
{
  "entry": "<rootProjectDir>/main/file/directory",
  "output": {
    "directory": "<outputDir>/directory",
    "filename": "filename"
  },
  "esbuild": "<rootProjectDir>/esbuild/config/file",
  "preloads": [ // or {  }
    ...
  ],
  "exclude": [
    ...
  ],
  "loaders": [
    ...
  ]
}
```

### Preload Config

The preload config is composed of the following properties:

- `entry` - The entry file of your preload process
- `reload` - Optional. If true, main process will be restarted after preload process is reloaded. Default: `false`
- `output` - The output configuration of bundle
  - `directory` - Optional. The output directory of your preload process. Default: same as `output.directory` of MainConfig
  - `filename` - The output filename of your preload process
- `esbuild` - Optional. Path to a javascript file exporting esbuild options
- `exclude` - Optional. An array of libs that you don't want to bundle
- `loaders` - Optional. An array of esbuild's loaders for specific files

```json5
{
  "entry": "<rootProjectDir>/preload/file/directory",
  "output": {
    "directory": "<outputDir>/directory",
    "filename": "filename"
  },
  "esbuild": "<rootProjectDir>/esbuild/config/file",
  "exclude": [
    ...
  ],
  "loaders": [
    ....
  ]
}
```

### Renderer Config

The renderer config has the following properties:

- `entry` - The entry file of your renderer process
- `html` - The html file of your renderer process
- `devPort` - Optional. The port of the dev server. If port is not available, it will try the next one
- `output` - The output configuration of bundle
  - `directory` - Optional. The output directory of your renderer process. Default: same as `output.directory` of MainConfig
  - `filename` - The output filename of your renderer process
- `esbuild` - Optional. Path to a javascript file exporting esbuild options
- `exclude` - Optional. An array of libs that you don't want to bundle
- `loaders` - Optional. An array of esbuild's loaders for specific files

```json5
{
  "entry": "<rootProjectDir>/renderer/file/directory",
  "html": "<rootProjectDir>/html/file/directory",
  "devPort": 8000,
  "output": {
    "directory": "<outputDir>/directory",
    "filename": "filename"
  },
  "esbuild": "<rootProjectDir>/esbuild/config/file",
  "exclude": [
    ...
  ],
  "loaders": [
    ...
  ]
}
```

### Resources Config

The resources config could be a string or an object.

If it is a string, it will be copied to the output directory of ElectronConfig.

If it is an object, it is composed of the following properties:

- `from` - The path of the file to copy
- `to` - Optional. The path of the file in the output directory. Default: same as `output.directory` of ElectronConfig

The `to` property also can be and object with the following properties:
- `directory` - The output directory of the file
- `filename` - The output filename of the file

```json5
[
  "path/to/file",
  "path/to/directory",
  {
    "from": "path/to/file",
    "to": "<outputDir>/path/to/output/directory"
  }.
  {
    "from": "path/to/file",
    "to": {
      "directory": "<outputDir>/path/to/output/directory",
      "filename": "filename"
    }
  }
]
```

## 📄 Examples

There are some examples in the [examples](https://github.com/eduardoleolim/electron-esbuild/tree/master/examples) directory.

- *[basic-js](https://github.com/eduardoleolim/electron-esbuild/tree/master/examples/basic-js)* - A basic example with javascript using the basic configuration of electron-esbuild.
- *[basic-ts](https://github.com/eduardoleolim/electron-esbuild/tree/master/examples/basic-ts)* - A basic example with typescript using the basic configuration of electron-esbuild.