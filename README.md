# @eduardoleolim/electron-esbuild

[![license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/eduardoleolim/electron-esbuild/blob/master/LICENSE)

Inspired by [electron-esbuild](https://github.com/Kiyozz/electron-esbuild) of [Kiyozz](https://github.com/Kiyozz).

A package to build your electron app with esbuild.

## Installation

```bash
npm install @eduardoleolim/electron-esbuild --save-dev
```

## Usage

```bash
npx electron-esbuild <command> [options]
```

### Commands

#### build

Builds your electron app.

Options:

- `--config or -c` - Path to the config file. Default: `electron-esbuild.config.json`

```bash
npx electron-esbuild build --config electron-esbuild.config.json
```

#### dev

Builds your electron app and starts a dev server for your renderer process.

Options:

- `--config or -c` - Path to the config file. Default: `electron-esbuild.config.json`
- `--clean` - Clean the output directory before building. Default: `false`

```bash
npx electron-esbuild dev --config electron-esbuild.config.json --clean
```

## Configuration

You can configure the build with a `electron-esbuild.config.json` file in the root of your project.

```json lines
[ // could be just one configuration or an array
  {
    "output": "dist", // optional, default: "dist"
    "main": {
      "entry": "path/to/main/file", // required
      "output": { // required
        "directory": "main", // directory inside <output>
        "filename": "main.js" // filename of file inside <output>/<directory>
      },
      "preloads": [ // optional, could be just one configuration or an array
        {
          "entry": "path/to/preload/file", // required
          "output": { // optional, by default will be the same as main's output
            "directory": "preload", // directory inside <output>
            "filename": "preload.js" // filename of file inside <output>/<directory>
          }
        }
      ],
      "exclude": [ // optional, libs that you don't want to bundle
        "sqlite3"
      ],
      "loaders": [ // optional, esbuild's loaders for specific files
        {
          "extension": ".svg",
          "loader": "file"
        }
      ]
    },
    "renderers": [ // could be just one configuration or an array
      {
        "entry": "path/to/renderer/file", // required
        "html": "path/to/html/file", // required
        "devPort": 8000, // optional, if port is not available, it will try the next one
        "output": { // optional, by default will be the same as main's output
          "directory": "preload", // directory inside <output>
          "filename": "preload.js" // filename of file inside <output>/<directory>
        },
        "exclude": [ // optional, libs that you don't want to bundle
          "sqlite3"
        ],
        "loaders": [ // optional, esbuild's loaders for specific files
          {
            "extension": ".svg",
            "loader": "file"
          }
        ]
      }
    ]
  }
]
```



