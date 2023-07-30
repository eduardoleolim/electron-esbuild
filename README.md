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

You can configure the build with a json or yaml file in the root of your project. The default name is `electron-esbuild.config.json` or `electron-esbuild.config.yaml`.

Electron-esbuild will look for the config file in the following order:

- The path specified in the `--config` option
- The default yaml file
- The default json file

### Electron Config

The electron config is composed of the following properties:

- `output` - Optional. The output directory of your electron app, default: `dist`
- `main` - The main process config
- `renderers` - Optional. The renderer process config can be an array of configs or a single config
- `extraFiles` - Optional. An array of files to copy to the output directory

```json5
{
  "output": "path/to/output/directory",
  "main": {},
  "renderers": [], // or {}
  "extraFiles": []
}
```

### Main Config

The main config is composed of the following properties:

- `entry` - The entry file of your main process
- `output` - The output configuration of bundle
  - `directory` - The output directory of your main process
  - `filename` - The output filename of your main process
- `plugins` - Optional. Path to a javascript file exporting an array of esbuild plugins
- `preloads` - Optional. A preload config can be an array of configs or a single config
- `exclude` - Optional. An array of libs that you don't want to bundle
- `loaders` - Optional. An array of esbuild's loaders for specific files

```json5
{
  "entry": "path/to/main/file",
  "output": {
    "directory": "path/to/output/directory",
    "filename": "filename.js"
  },
  "plugins": "path/to/plugins/file",
  "preloads": [], // or {}
  "exclude": [],
  "loaders": []
}
```

### Preload Config

The preload config is composed of the following properties:

- `entry` - The entry file of your preload process
- `reload` - Optional. If true, main process will be restarted after preload process is reloaded. Default: `false`
- `plugins` - Optional. Path to a javascript file exporting an array of esbuild plugins
- `output` - Optional. The output configuration of bundle. Default: same as main's output
  - `directory` - The output directory of your preload process
  - `filename` - The output filename of your preload process
- `exclude` - Optional. An array of libs that you don't want to bundle
- `loaders` - Optional. An array of esbuild's loaders for specific files

```json5
{
  "entry": "path/to/preload/file",
  "plugins": "path/to/plugins/file",
  "output": {
    "directory": "path/to/output/directory",
    "filename": "filename.js"
  },
  "exclude": [],
  "loaders": []
}
```

### Renderer Config

The renderer config is composed of the following properties:

- `entry` - The entry file of your renderer process
- `html` - The html file of your renderer process
- `plugins` - Optional. Path to a javascript file exporting an array of esbuild plugins
- `devPort` - Optional. The port of the dev server. If port is not available, it will try the next one
- `output` - Optional. The output configuration of bundle
  - `directory` - The output directory of your renderer process
  - `filename` - The output filename of your renderer process
- `exclude` - Optional. An array of libs that you don't want to bundle
- `loaders` - Optional. An array of esbuild's loaders for specific files

```json5
{
  "entry": "path/to/renderer/file",
  "html": "path/to/html/file",
  "plugins": "path/to/plugins/file",
  "devPort": 8000,
  "output": {
    "directory": "path/to/output/directory",
    "filename": "filename.js"
  },
  "exclude": [],
  "loaders": []
}
```

### Extra Files Config

The extra files config could be a string or an object.

If it is a string, it will be copied to the output directory of ElectronConfig.

If it is an object, it is composed of the following properties:

- `from` - The path of the file to copy
- `to` - Optional. The path of the file in the output directory. Default: same as `from`

```json5
[
  "path/to/file",
  "path/to/directory",
  {
    "from": "path/to/file",
    "to": "path/to/output/directory"
  }
]
```

## 👀 Examples

### Simple configuration

<details>
  <summary>Json syntax</summary>

  ```json5
  // electron-esbuild.config.json

  {
    "main": {
      "entry": "src/main/index.ts",
      "output": {
        "directory": "dist/main",
        "filename": "index.js"
      }
    },
    "renderers": {
      "entry": "src/renderer/index.tsx",
      "html": "src/renderer/index.html",
      "output": {
        "directory": "dist/renderer",
        "filename": "index.js"
      }
    }
  }
  ```
</details>

<details>
  <summary>Yaml syntax</summary>


  ```yaml
  # electron-esbuild.config.yaml

  output: dist
  main:
    entry: src/main/index.ts
    output:
      directory: dist/main
      filename: index.js
  renderers:
    entry: src/renderer/index.tsx
    html: src/renderer/index.html
    output:
      directory: dist/renderer
      filename: index.js
  ```
</details>

### Main with preload

<details>
  <summary>Json syntax</summary>

  ```json5
  // electron-esbuild.config.json

  {
    "output": "dist",
    "main": {
      "entry": "src/main/index.ts",
      "output": {
        "directory": "dist/main",
        "filename": "index.js"
      },
      "preloads": {
        "entry": "src/preload/index.ts",
        "output": {
          "directory": "dist/preload",
          "filename": "index.js"
        }
      }
    },
    "renderers": {
      "entry": "src/renderer/index.tsx",
      "html": "src/renderer/index.html",
      "output": {
        "directory": "dist/renderer",
        "filename": "index.js"
      }
    }
  }
  ```
</details>

<details>
  <summary>Yaml syntax</summary>

  ```yaml
  # electron-esbuild.config.yaml

  output: dist
  main:
    entry: src/main/index.ts
    output:
      directory: dist/main
      filename: index.js
    preloads:
      entry: src/preload/index.ts
      output:
        directory: dist/preload
        filename: index.js
  renderers:
    entry: src/renderer/index.tsx
    html: src/renderer/index.html
    output:
      directory: dist/renderer
      filename: index.js
  ```
</details>

### Multiple preloads

<details>
  <summary>Json syntax</summary>

  ```json5
  // electron-esbuild.config.json

  {
    "main": {
      "entry": "src/main/index.ts",
      "output": {
        "directory": "dist/main",
        "filename": "index.js"
      },
      "preloads": [
        {
          "entry": "src/preload/index.ts",
          "output": {
            "directory": "dist/preload",
            "filename": "index.js"
          }
        },
        {
          "entry": "src/preload/index2.ts",
          "output": {
            "directory": "dist/preload",
            "filename": "index2.js"
          }
        }
      ]
    },
    "renderers": {
      "entry": "src/renderer/index.tsx",
      "html": "src/renderer/index.html",
      "output": {
        "directory": "dist/renderer",
        "filename": "index.js"
      }
    }
  }
  ```
</details>

<details>
  <summary>Yaml syntax</summary>

  ```yaml
  # electron-esbuild.config.yaml

  main:
    entry: src/main/index.ts
    output:
      directory: dist/main
      filename: index.js
    preloads:
    - entry: src/preload/index.ts
      output:
        directory: dist/preload
        filename: index.js
    - entry: src/preload/index2.ts
      output:
        directory: dist/preload
        filename: index2.js
  renderers:
    entry: src/renderer/index.tsx
    html: src/renderer/index.html
    output:
      directory: dist/renderer
      filename: index.js
  ```
</details>

### Extra files

<details>
  <summary>Json syntax</summary>

  ```json5
  // electron-esbuild.config.json

  {
    "main": {
      "entry": "src/main/index.ts",
      "output": {
        "directory": "dist/main",
        "filename": "index.js"
      }
    },
    "renderers": {
      "entry": "src/renderer/index.tsx",
      "html": "src/renderer/index.html",
      "output": {
        "directory": "dist/renderer",
        "filename": "index.js"
      }
    },
    "extraFiles": [
      "path/to/file",
      {
        "from": "path/to/file",
        "to": "path/to/output/directory"
      }
    ]
  }
  ```
</details>

<details>
  <summary>Yaml syntax</summary>

  ```yaml
  # electron-esbuild.config.yaml

  main:
    entry: src/main/index.ts
    output:
      directory: dist/main
      filename: index.js
  renderers:
    entry: src/renderer/index.tsx
    html: src/renderer/index.html
    output:
      directory: dist/renderer
      filename: index.js
  extraFiles:
  - path/to/file
  - from: path/to/file
    to: path/to/output/directory
  ```
</details>

### Exclude libs in main and renderer

<details>
  <summary>Json syntax</summary>

  ```json5
  // electron-esbuild.config.json

  {
    "main": {
      "entry": "src/main/index.ts",
      "output": {
        "directory": "dist/main",
        "filename": "index.js"
      },
      "exclude": [
        "lib1",
        "lib2"
      ]
    },
    "renderers": {
      "entry": "src/renderer/index.tsx",
      "html": "src/renderer/index.html",
      "output": {
        "directory": "dist/renderer",
        "filename": "index.js"
      },
      "exclude": [
        "lib1",
        "lib2"
      ]
    }
  }
  ```
</details>

<details>
  <summary>Yaml syntax</summary>

  ```yaml
  # electron-esbuild.config.yaml

  main:
    entry: src/main/index.ts
    output:
      directory: dist/main
      filename: index.js
    exclude:
    - lib1
    - lib2
  renderers:
    entry: src/renderer/index.tsx
    html: src/renderer/index.html
    output:
      directory: dist/renderer
      filename: index.js
    exclude:
    - lib1
    - lib2
  ```
</details>

### Multiple main and renderer configurations

<details>
  <summary>Json syntax</summary>

  ```json5
  // electron-esbuild.config.json

  [
    {
      "output": "dist",
      "main": {
        "entry": "src/main/index.ts",
        "output": {
          "directory": "dist/main",
          "filename": "index.js"
        }
      },
      "renderers": [
        {
          "entry": "src/renderer/index.tsx",
          "html": "src/renderer/index.html",
          "output": {
            "directory": "dist/renderer",
            "filename": "index.js"
          }
        },
        {
          "entry": "src/renderer/index2.tsx",
          "html": "src/renderer/index2.html",
          "output": {
            "directory": "dist/renderer",
            "filename": "index2.js"
          }
        }
      ]
    },
    {
      "output": "dist2",
      "main": {
        "entry": "src/main/index2.ts",
        "output": {
          "directory": "dist/main",
          "filename": "index2.js"
        }
      },
      "renderers": [
        {
          "entry": "src/renderer/index3.tsx",
          "html": "src/renderer/index3.html",
          "output": {
            "directory": "dist/renderer",
            "filename": "index3.js"
          }
        },
        {
          "entry": "src/renderer/index4.tsx",
          "html": "src/renderer/index4.html",
          "output": {
            "directory": "dist/renderer",
            "filename": "index4.js"
          }
        }
      ]
    }
  ]
  ```
</details>

<details>
  <summary>Yaml syntax</summary>

  ```yaml
  # electron-esbuild.config.yaml

  - output: dist
    main:
      entry: src/main/index.ts
      output:
        directory: dist/main
        filename: index.js
    renderers:
    - entry: src/renderer/index.tsx
      html: src/renderer/index.html
      output:
        directory: dist/renderer
        filename: index.js
    - entry: src/renderer/index2.tsx
      html: src/renderer/index2.html
      output:
        directory: dist/renderer
        filename: index2.js
  - output: dist2
    main:
      entry: src/main/index2.ts
      output:
        directory: dist/main
        filename: index2.js
    renderers:
    - entry: src/renderer/index3.tsx
      html: src/renderer/index3.html
      output:
        directory: dist/renderer
        filename: index3.js
    - entry: src/renderer/index4.tsx
      html: src/renderer/index4.html
      output:
        directory: dist/renderer
        filename: index4.js
  ```
</details>

### Add esbuild plugins

<details>
  <summary>Json syntax</summary>

  ```json5
  // electron-esbuild.config.json

  {
    "main": {
      "entry": "src/main/index.ts",
      "output": {
        "directory": "dist/main",
        "filename": "index.js"
      },
      "plugins": "config/plugins.js"
    },
    "renderers": {
      "entry": "src/renderer/index.tsx",
      "html": "src/renderer/index.html",
      "output": {
        "directory": "dist/renderer",
        "filename": "index.js"
      },
      "plugins": "config/plugins.mjs"
    }
  }
  ```

</details>

<details>
  <summary>Yaml syntax</summary>

  ```yaml
  # electron-esbuild.config.yaml

  main:
    entry: src/main/index.ts
    output:
      directory: dist/main
      filename: index.js
    plugins: config/plugins.js
  renderers:
    entry: src/renderer/index.tsx
    html: src/renderer/index.html
    output:
      directory: dist/renderer
      filename: index.js
    plugins: config/plugins.mjs
  ```
</details>

<details>
  <summary>Plugins scripts</summary>

  ```js
  // config/plugins.js

  const { esbuildPlugin } = require('esbuild-plugin');

  module.exports = [
    esbuildPlugin()
  ];
  ```

  ```js
  // config/plugins.mjs

  import { esbuildPlugin } from 'esbuild-plugin';

  export default [
    esbuildPlugin()
  ];
  ```
</details>



