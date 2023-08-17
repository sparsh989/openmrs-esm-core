export default {
  transform: {
    "^.+\\.(j|t)sx?$": ["@swc/jest"],
  },
  testEnvironment: "jsdom",
  testEnvironmentOptions: {
    url: "http://localhost/",
  },
};
