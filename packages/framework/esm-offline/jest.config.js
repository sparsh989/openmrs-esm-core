export default {
  transform: {
    "^.+\\.(j|t)sx?$": ["@swc/jest"],
  },
  moduleNameMapper: {
    "^lodash-es/(.*)$": "lodash/$1",
  },
  testEnvironment: "jsdom",
  testEnvironmentOptions: {
    url: "http://localhost/",
  },
};
