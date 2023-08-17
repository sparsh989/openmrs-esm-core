export default {
  transform: {
    "^.+\\.(j|t)sx?$": ["@swc/jest"],
  },
  setupFiles: [],
  moduleNameMapper: {
    "@openmrs/esm-globals": "<rootDir>/__mocks__/openmrs-esm-globals.mock.tsx",
  },
  testEnvironment: "jsdom",
  testEnvironmentOptions: {
    url: "http://localhost/",
  },
};
