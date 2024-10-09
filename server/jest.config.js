module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testPathIgnorePatterns: ["/node_modules/", "/dist/"],
  roots: ["<rootDir>/test"], // Specify the root directory for tests
  testMatch: ["**/*.test.ts"], // Only look for .test.ts files
};
