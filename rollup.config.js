import commonjs from "@rollup/plugin-commonjs";
import nodeResolve from "@rollup/plugin-node-resolve";
import { babel } from "@rollup/plugin-babel";

export default {
    input: "src/index.js",
    output: {
        file: "dist/bundle.js",
        format: "iife",
        sourcemap: true
    },
    plugins: [
        // resolve node modules path import
        nodeResolve(),
        commonjs({ 
            // make sure commonjs plugin only processes node modules
            include: ['node_modules/**']
        }),
        babel({
            babelHelpers: "bundled",
            exclude: "node_modules/**",
            extensions: ['.js', '.jsx']
        })
    ]
};
