export default {
  transform: {
    "^.+\\.(j|t)sx?$": ["@swc/jest"],
  },
  moduleNameMapper: {},
  testEnvironment: "jsdom",
  testEnvironmentOptions: {
    url: "http://localhost/",
  },
};
