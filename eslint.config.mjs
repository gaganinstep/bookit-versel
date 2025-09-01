import globals from "globals";
import pluginJs from "@eslint/js";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ["**/*.js"],
    languageOptions: {
      sourceType: "commonjs", // specify the module system
      globals: {
        ...globals.browser, // include browser globals if needed
        process: "readonly", // allow process as a global variable
        __dirname: "readonly", // explicitly define __dirname
        Buffer: "readonly", // explicitly define Buffer
      },
    },
  },
  pluginJs.configs.recommended, // use the recommended config from @eslint/js
];
