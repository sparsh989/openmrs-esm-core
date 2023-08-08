import clean from "@rollup-extras/plugin-clean";
import resolve from "@rollup/plugin-node-resolve";
import swc from "@rollup/plugin-swc";
import typescript from "@rollup/plugin-typescript";
import bundleAnalyzer from "rollup-plugin-bundle-analyzer";
import { basename, dirname } from "node:path";
import packageJson from "./package.json" assert { type: "json" };

const useAnalyzer = process.env.ANALYZE === "true";

/** @type {import("rollup").RollupOptions}  */
export default {
  input: {
    [basename(packageJson.module, ".js")]: "src/index.ts",
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
    resolve(),
    clean({ targets: [dirname(packageJson.module)] }),
    swc(),
    typescript({ emitDeclarationOnly: true }),
    useAnalyzer && bundleAnalyzer(),
  ].filter(Boolean),
  external: Object.keys(packageJson.peerDependencies ?? {}),
};
