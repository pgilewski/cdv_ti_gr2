# # techint Web E2E

You can run several commands:

`npx playwright test` Runs the end-to-end tests.

`npx playwright test --ui` Starts the interactive UI mode.

`npx playwright test --project=chromium` Runs the tests only on Desktop Chrome.

`npx playwright test example` Runs the tests in a specific file.

`npx playwright test --debug` Runs the tests in debug mode.

`npx playwright codegen` Auto generate tests with Codegen.

And check out the following files:

- ./web-e2e/tests/example.spec.ts - Example end-to-end test
- ./web-e2e/tests-examples/demo-todo-app.spec.ts - Demo Todo App end-to-end tests
- ./web-e2e/playwright.config.ts - Playwright Test configuration

Visit https://playwright.dev/docs/intro for more information.
