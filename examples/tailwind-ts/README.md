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
  devPort: 8080
  entry: src/renderer/index.ts
  html: src/renderer/index.html
  output:
    directory: renderer
    filename: renderer.js
  esbuild: electron-esbuild.renderer.config.js
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
  - esbuild: The path of base esbuild config file


## 🎨 Setting Up esbuild with TailwindCSS

To integrate TailwindCSS with esbuild, follow these steps to configure the required files:

1. **Install Dependencies**: Ensure you have installed the following packages for TailwindCSS to work correctly with esbuild:
   
   ```json
   "esbuild-postcss": "0.0.4",
   "postcss": "8.4.47",
   "tailwindcss": "3.4.14"
   ```

2. **`tailwind.config.js`**: Define the configuration for TailwindCSS in this file. Specify the content files where Tailwind should look for class names to generate the required styles.

   ```js
   /** @type {import("tailwindcss").Config} */
   module.exports = {
       content: ['./src/renderer/**/*.{ts,tsx}', './src/renderer/index.html'],
       theme: {
           extend: {
               // Add any theme customization here
           }
       },
       plugins: []
   }
   ```

3. **`postcss.config.js`**: TailwindCSS uses PostCSS to process its styles. Here, `tailwindcss` and `autoprefixer` are configured as plugins for PostCSS, allowing esbuild to handle styles correctly.

   ```js
   module.exports = {
       plugins: {
           tailwindcss: { },
           autoprefixer: { },
       }
   }
   ```

4. **`electron-esbuild.renderer.config.js`**: Finally, configure esbuild to use PostCSS during the build process. The `esbuild-postcss` plugin will automatically load the PostCSS configuration.

   ```js
   const postcss = require("esbuild-postcss")

   /** @type {import("esbuild").BuildOptions} */
   module.exports = {
       plugins: [
           postcss()
       ]
   }
   ```

5. **`index.css`**: In the main CSS file, include the base Tailwind directives to apply the framework’s styles throughout the project.

    ```css
    @tailwind base;
    @tailwind components;
    @tailwind utilities;
    ```


With this setup, esbuild will process TailwindCSS styles in the specified files and automatically generate the required styles during the project build.
