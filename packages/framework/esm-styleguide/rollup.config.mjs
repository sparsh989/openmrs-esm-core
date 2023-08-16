import clean from "@rollup-extras/plugin-clean";
import commonjs from "@rollup/plugin-commonjs";
import image from "@rollup/plugin-image";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import postcss from "rollup-plugin-postcss";
import swc from "@rollup/plugin-swc";
import typescript from "@rollup/plugin-typescript";
import bundleAnalyzer from "rollup-plugin-bundle-analyzer";
import { basename, dirname, sep } from "node:path";
import packageJson from "./package.json" assert { type: "json" };

const useAnalyzer = process.env.ANALYZE === "true";

/** @type {import("rollup").RollupOptions}  */
export default {
  input: {
    [basename(packageJson.module, ".js")]: "src/index.ts",
    internal: "src/internal.ts",
    public: "src/public.ts",
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
    image(),
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
