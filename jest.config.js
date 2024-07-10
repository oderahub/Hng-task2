module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  modulePathIgnorePatterns: ["<rootDir>/dist/"],
  testMatch: ["**/?(*.)+(spec|test).[tj]s?(x)"],
};
