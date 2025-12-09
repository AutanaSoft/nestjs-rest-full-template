---
trigger: always_on
---

# E2E Testing Guidelines

This document outlines the authoritative rules for creating End-to-End (E2E) tests in this project. The Agent must follow these patterns when generating or modifying tests.

## 1. Architecture Patterns

### Single App Instance

- **Do not** create a new application instance for every test file.
- The application is initialized once in `test/app.e2e-spec.ts`.
- Sub-suites (module tests) must export a function that accepts an accessor to the app instance.

**Example Pattern:**

```typescript
export const myModuleTest = (getApp: () => NestFastifyApplication) => {
  describe('MyModule (e2e)', () => {
    let app: NestFastifyApplication;

    beforeAll(() => {
      app = getApp();
    });
    // ... tests
  });
};
```

### Modular Organization

- Tests must be located in `test/modules/<module-name>/`.
- Mirrors the `src/modules` structure.
- Each module's main spec file (e.g., `auth.controller.spec.ts`) acts as an orchestrator for that module's feature tests.

## 2. Database & Cleanup Strategy

### "Clean Start" (Mandatory)

- Always clean the necessary data **before** the tests run (`beforeAll`).
- This ensures idempotency: even if a previous run crashed, the current run starts with a clean slate.

### "Clean End" (Recommended)

- Clean up data **after** tests (`afterAll`) to keep the DB tidy.
- Never rely _only_ on `afterAll` for correctness.

**Implementation Example:**

```typescript
beforeAll(async () => {
  app = getApp();
  await cleanupTestData(app); // Clean Start
});

afterAll(async () => {
  await cleanupTestData(app); // Clean End (Courtesy)
});
```

## 3. Configuration Consistency

### Environment Parity

- The test application in `app.e2e-spec.ts` must match `src/main.ts` configuration.
- Must include:
  - `FastifyAdapter`
  - `ValidationPipe` (Global)
  - `ClassSerializerInterceptor` (Global)
  - Same `appConfig` and environment variables.

### Utils & Helpers

- Use `test/utils/test.utils.ts` for shared constants, data factories, and cleanup functions.
- Avoid hardcoding shared values (like test emails) in multiple files.

## 4. Naming Conventions

- **Entry Point:** `test/app.e2e-spec.ts` (The only file Jest executes directly).
- **Module Suites:** `*.controller.spec.ts`.
  - **IMPORTANT:** Do NOT use `.e2e-spec.ts` for module suites. This suffix is reserved for the entry point. Using it elsewhere will cause Jest to try running the file in isolation, leading to failures.
- **Feature Tests:** `*.spec.ts` (imported by module suites).
