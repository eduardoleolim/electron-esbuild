# Basic example with TailwindCSS, React and Typescript

This is a basic example of how to use electron-esbuild with TailwindCSS. React and TypeScript.

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
  entry: src/renderer/index.tsx
  html: src/renderer/index.html
  base: electron-esbuild.renderer.config.js
  devPort: 8080
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
  - base: The path of base esbuild config file


## 🎨 Setting Up esbuild with TailwindCSS

To integrate TailwindCSS v4 with esbuild, follow these steps to configure the required files:

1. **Install Dependencies**: Ensure you have installed the following packages for TailwindCSS to work correctly with esbuild:
   
   ```json
   // Install those version or major
   "@tailwindcss/postcss": "4.1.1"
   "esbuild-postcss": "0.0.4",
   "postcss": "8.5.3",
   "tailwindcss": "4.1.1"
   ```

2. **`postcss.config.js`**: TailwindCSS uses PostCSS to process its styles. Here, `@tailwindcss/postcss` is configured as plugins for PostCSS, allowing esbuild to handle styles correctly.

   ```js
   module.exports = {
    plugins: {
      "@tailwindcss/postcss": {},
    },
  };
   ```

3. **`electron-esbuild.renderer.config.js`**: Configure esbuild to use PostCSS during the build process. The `esbuild-postcss` plugin will automatically load the PostCSS configuration.

   ```js
   const postcss = require("esbuild-postcss")

   /** @type {import("esbuild").BuildOptions} */
   module.exports = {
       plugins: [
           postcss()
       ]
   }
   ```

4. **`index.css`**: Finnaly, in the main CSS file include the base Tailwind directives to apply the framework’s styles throughout the project.

    ```css
    @import "tailwindcss";
    ```


With this setup, esbuild will process TailwindCSS v4 styles in the specified files and automatically generate the required styles during the project build.
