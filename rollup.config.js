import { defineConfig } from "rollup"
import rollupPluginTypescript from "@rollup/plugin-typescript"
import rollupPluginNodeResolve from "@rollup/plugin-node-resolve"
import rollupComonjs from "@rollup/plugin-commonjs"
import rollupJson from "@rollup/plugin-json"

export default defineConfig({
    input: "src/main.ts",
    output: {
        file: "dist/main.js",
        format: "es"
    },
    plugins: [
        rollupPluginTypescript(),
        rollupPluginNodeResolve(),
        rollupComonjs(),
        rollupJson(),
    ],
})