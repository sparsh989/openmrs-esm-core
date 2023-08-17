import clean from "@rollup-extras/plugin-clean";
import commonjs from "@rollup/plugin-commonjs";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import postcss from "rollup-plugin-postcss";
import swc from "@rollup/plugin-swc";
import typescript from "@rollup/plugin-typescript";
import bundleAnalyzer from "rollup-plugin-bundle-analyzer";
import svg from "rollup-plugin-svg";
import MagicString from "magic-string";
import { basename, dirname } from "node:path";
import packageJson from "./package.json" assert { type: "json" };

const useAnalyzer = process.env.ANALYZE === "true";

/** @type {import("rollup").RollupOptions}  */
export default {
  input: {
    [basename(packageJson.module, ".js")]: "src/index.ts",
    internal: "src/internal.ts",
    shell: "src/shell.ts",
  },
  output: [
    {
      dir: dirname(packageJson.module),
      format: "module",
      sourcemap: true,
    },
  ],
  plugins: [
    nodeResolve({
      extensions: [".mjs", ".js", ".json", ".ts", ".tsx"],
    }),
    commonjs(),
    clean({ targets: [dirname(packageJson.module)] }),
    /**
     * This is a custom rollup plugin to handle some weird special-case logic for styleguide.
     * The styleguide is both part of esm-framework and independently imported in various.
     * Consequently, it cannot directly depend on esm-framework at build time, but should at
     * run time. Here we re-write imports from esm-framework sub-components into imports from
     * esm-framework.
     *
     * Based off [rollup-plugin-rewrite-imports](https://github.com/elmsln/rollup-plugin-rewrite-imports),
     * though re-worked quite a bit.
     */
    (() => {
      const patternImport = new RegExp(
        /import(?:["'\s]*(?:[\w*${}\n\r\t, ]+)from\s*)?["'\s]["'\s](@openmrs\/esm-[\w_-]+)["'\s].*;$/,
        "dgm"
      );
      const patternDynamicImport = new RegExp(
        /import\((?:["'\s]*(?:[\w*{}\n\r\t, ]+)\s*)?["'\s](@openmrs\/esm-[\w_-]+)["'\s].*\);$/,
        "dgm"
      );
      return {
        name: "openmrs-styleguide-import-rewrite-plugin",
        /**
         * @param {string} code
         */
        renderChunk(code) {
          // magicString helps us maintain the source map correctly
          const magicString = new MagicString(code);
          let hasReplacement = false;

          function rewriteImport(_import) {
            hasReplacement = true;
            magicString.overwrite(
              _import.indices[1][0],
              _import.indices[1][1],
              "@openmrs/esm-framework"
            );
          }

          for (let _import of code.matchAll(patternImport)) {
            rewriteImport(_import);
          }

          for (let _import of code.matchAll(patternDynamicImport)) {
            rewriteImport(_import);
          }

          return hasReplacement
            ? { code: magicString.toString(), map: magicString.generateMap() }
            : null;
        },
      };
    })(),
    svg(),
    postcss({
      extract: `${basename(packageJson.module, ".js")}.css`,
      minimize: true,
      namedExports: true,
      sourceMap: true,
      use: [
        [
          "sass",
          {
            includePaths: ["./src", "./node_modules", "../../../node_modules"],
          },
        ],
      ],
    }),
    swc(),
    typescript({ emitDeclarationOnly: true }),
    useAnalyzer && bundleAnalyzer(),
  ].filter(Boolean),
  external: Object.keys(packageJson.peerDependencies ?? {}),
};
