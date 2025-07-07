import { babel } from "@rollup/plugin-babel";

export default {
    input: "src/index.js",
    output: {
        file: "public/bundle.js",
        format: "iife",
        sourcemap: true
    },
    plugins: [
        babel({babelHelpers: "bundled"})
    ]
};
