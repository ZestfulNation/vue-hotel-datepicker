module.exports = {
  setupFiles: ["<rootDir>/tests/jest.setup.js"],
  verbose: false,
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.js$": "babel-jest",
    ".*\\.(vue)$": "vue-jest"
  },
  moduleFileExtensions: ["js", "vue"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src",
    "^~/(.*)$": "<rootDir>/src",
    "^vue$": "vue/dist/vue.common.js"
  },
  collectCoverage: true,
  collectCoverageFrom: ["<rootDir>/components/**/*.vue"],
  restoreMocks: true,
  clearMocks: true,
  resetMocks: true
};
