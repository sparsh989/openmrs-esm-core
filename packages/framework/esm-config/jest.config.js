export default {
  transform: {
    "^.+\\.(j|t)sx?$": ["@swc/jest"],
  },
  setupFiles: ["<rootDir>/setup-tests.js"],
  moduleNameMapper: {
    "@openmrs/esm-context": "<rootDir>/__mocks__/openmrs-esm-context.mock.tsx",
    "@openmrs/esm-globals": "<rootDir>/__mocks__/openmrs-esm-globals.mock.tsx",
    "@openmrs/esm-state": "<rootDir>/__mocks__/openmrs-esm-state.mock.tsx",
  },
  testEnvironment: "jsdom",
  testEnvironmentOptions: {
    url: "http://localhost/",
  },
};
