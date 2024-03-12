# Svelte with TypeScript Example

This is a basic example of how to use electron-esbuild with TypeScript and Svelte.

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
  esbuild: electron-esbuild.renderer.mjs
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
  - `esbuild`: The esbuild config file for the renderer process. It is relative to the root of the project

  ### 📦 esbuild config

  The file `electron-esbuild.renderer.mjs` is the esbuild config file for the renderer process. For allowing svelte to be used with esbuild, the `esbuild-svelte` package is used.

  Install the `esbuild-svelte` package

  ```bash
  npm install esbuild-svelte --save-dev
  ```

  ```javascript
  import esbuild from 'esbuild';
  import sveltePlugin from "esbuild-svelte";

  /**
  * @type {esbuild.BuildOptions}
  */
  const config = {
      plugins: [sveltePlugin()]
  }

  export default config;
  ```

  If typescript is used with svelte, it is necessary to add the `svelte-preprocess` plugin to the esbuild config file.

  Install the `svelte-preprocess` package

  ```bash
  npm install svelte-preprocess --save-dev
  ```

  Update the esbuild config file

  ```javascript
  import esbuild from 'esbuild';
  import sveltePlugin from "esbuild-svelte";
  import sveltePreprocess from 'svelte-preprocess';

  /**
   * @type {esbuild.BuildOptions}
   */
  const config = {
      plugins: [sveltePlugin({
          preprocess: sveltePreprocess()
      })]
  }

  export default config;
  ```