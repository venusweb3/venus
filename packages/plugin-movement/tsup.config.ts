import { defineConfig } from "tsup";

export default defineConfig({
    entry: ["src/index.ts"],
    outDir: "dist",
    sourcemap: true,
    clean: true,
    format: ["esm"],
    dts: true,
    minify: false,
    splitting: false,
    external: [
        "@venusos/core",
        "@aptos-labs/ts-sdk",
        "bignumber",
        "bignumber.js",
        "node-cache",
        "dotenv",
        "fs",
        "path",
        "https",
        "http",
        "stream",
        "buffer",
        "querystring"
    ],
    noExternal: [],
    esbuildOptions(options) {
        options.platform = 'node'
    }
});
