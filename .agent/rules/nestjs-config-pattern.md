---
trigger: always_on
---

# NestJS Configuration Files Pattern

This project follows a strict pattern for configuration files to ensure consistency, type safety, and proper integration with `@nestjs/config`.

## File Naming and Location

- **Location**: All configuration files must be placed in `src/config/`.
- **Naming**: Use kebab-case with the `.config.ts` suffix (e.g., `app.config.ts`, `throttler.config.ts`).

## Implementation Structure

Every configuration file must follow this structure:

1.  **Interface Definition** (Recommended): Define an interface or type for the configuration object.
2.  **Factory Function**: Create an exported factory function named `xxxConfigFactory` that reads from `process.env` and returns the typed configuration object.
3.  **Registration**: Export default using `registerAs` from `@nestjs/config`, using a namespace key matching the config name (camelCase).

### Example Template

```typescript
import { registerAs } from '@nestjs/config';

/**
 * Interface that defines the configuration options.
 */
export interface MyModuleConfig {
  enabled: boolean;
  apiKey: string;
}

/**
 * Factory that generates the configuration from environment variables.
 *
 * @returns MyModuleConfig object.
 */
export const myModuleConfigFactory = (): MyModuleConfig => ({
  enabled: process.env.MY_MODULE_ENABLED === 'true',
  apiKey: process.env.MY_MODULE_API_KEY ?? 'default-key',
});

/**
 * Registration of the configuration in the NestJS container.
 */
export default registerAs<MyModuleConfig>(
  'myModuleConfig',
  (): MyModuleConfig => myModuleConfigFactory(),
);
```

## Validation & Type Conversion

- Always perform type conversions (e.g., `Number()`, boolean checks) within the factory.
- Use sensible defaults using `??` or `||`.

## Usage

- **Injection**: When using `ConfigService`, access the configuration using the namespace key defined in `registerAs` (e.g., `configService.get<MyModuleConfig>('myModuleConfig')`).
- **Direct Usage**: For manual instantiation (e.g., in `main.ts` or test utilities), import and call the factory function directly (`myModuleConfigFactory()`).
