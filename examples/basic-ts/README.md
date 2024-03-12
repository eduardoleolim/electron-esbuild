# Basic example

This is a basic example of how to use electron-esbuild with TypeScript.

## 🚀 Getting Started

### 📦 Install

```bash
npm install
```

### 🛠️ Build

```bash
npm run build
```

### 👨‍💻 Dev

```bash
npm run dev
```

## 📄 Configuration

The configuration file is `electron-esbuild.config.yaml` in the root of the project.

```yaml
output: dist
main:
  entry: src/main/main.ts
  output:
    directory: main
    filename: main.js
renderers:
  devPort: 8080
  entry: src/renderer/index.ts
  html: src/renderer/index.html
  output:
    directory: renderer
    filename: renderer.js
```

Each section of the configuration file is explained below.

- `output`: The output directory of the electron app, default: `dist`. It is relative to the root of the project

- `main`: The main process config

  - `entry`: The entry file of the main process
  - `output`: The output configuration of bundle
    - `directory`: The output directory of the main process. It is relative to the `output` property of ElectronConfig
    - `filename`: The output filename of the main process

- `renderers`: The renderer process config can be an array of configs or a single config
  - `devPort`: The port of the dev server
  - `entry`: The entry file of the renderer process
  - `html`: The html file of the renderer process. It will have the script and link tags for the output of the renderer process
  - `output`: The output configuration of bundle
    - `directory`: The output directory of the renderer process. It is relative to the `output` property of ElectronConfig
    - `filename`: The output filename of the renderer process
