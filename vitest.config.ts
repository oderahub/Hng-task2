import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // Enabling globals allows you to access global variables defined in your tests
    globals: true,

    // Setting the environment to "node" is appropriate for most cases
    // where you're running tests in a Node.js environment.
    environment: "node",

    // Specifying setup files is useful for running custom setup code
    // before your tests run. This is where you'd typically initialize
    // databases, mock external modules, or perform other setup tasks.
    setupFiles: ["./tests/setup.ts"],

    // Including patterns allow you to specify which files should be
    // considered as test files. By including "*.spec.ts", you're telling
    // Vitest to run tests found in files that end with ".spec.ts".
    // Note: Using "**/*.spec.ts" would be more comprehensive, covering
    // subdirectories as well.
    include: ["**/*.spec.ts"],

    // Optionally, you can exclude certain files or directories from being
    // tested. This is useful for ignoring third-party libraries or
    // generated files.
    exclude: ["node_modules/**/*", "__mocks__/**/*"],

    // Vitest allows you to customize the test timeout per spec file.
    // This can be particularly useful for long-running tests.
    // Remove the timeout property

    // Running tests in parallel can significantly speed up your test suite.
    // By default, Vitest runs tests in parallel.
    // Remove the parallel property

    // If you want to collect coverage reports, you can enable it here.
    // Note: Coverage collection may slow down your tests.
    coverage: {
      provider: "istanbul", // Using istanbul as the coverage provider
      include: ["**/*.ts"], // Including TypeScript files in coverage report
    },
  },
});
