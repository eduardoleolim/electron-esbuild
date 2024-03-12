import esbuild from 'esbuild';
import sveltePlugin from "esbuild-svelte";
import sveltePreprocess from "svelte-preprocess";

/**
 * @type {esbuild.BuildOptions}
 */
const config = {
    plugins: [sveltePlugin({
      preprocess: sveltePreprocess(), // Necessary for TypeScript
    })]
}

export default config;