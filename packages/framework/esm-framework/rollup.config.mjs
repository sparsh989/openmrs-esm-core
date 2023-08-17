import clean from "@rollup-extras/plugin-clean";
import commonjs from "@rollup/plugin-commonjs";
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
    internal: "src/internal.ts",
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
    commonjs(),
    clean({ targets: [dirname(packageJson.module)] }),
    /**
     * Custom Rollup plugin to rewrite imports for internal packages from, e.g.,
     * "@openmrs/esm-config/src/public" -> "@openmrs/esm-config/dist/public"
     *
     * Basically, this is so that we can co-exist successfully with TypeDoc. In particular,
     * the generated documentation should refer to the source code in the rolled-up module;
     * however, at actual runtime, we should simply import the pre-compiled code from dist.
     */
    (() => {
      const patternOpenmrsPackage = /^@openmrs\/esm-[\w-]+\/(src)\//;
      return {
        name: "openmrs-framework-import-rewrite-plugin",
        /**
         * @param {string} source
         * @param {string | undefined} importer
         */
        resolveId(source) {
          let m = source.match(patternOpenmrsPackage);
          if (!m) {
            return null;
          } else {
            return this.resolve(source.replace("/src/", "/dist/"));
          }
        },
      };
    })(),
    swc(),
    typescript({ emitDeclarationOnly: true }),
    useAnalyzer && bundleAnalyzer(),
  ].filter(Boolean),
  external: Object.keys(packageJson.peerDependencies ?? {}),
};
