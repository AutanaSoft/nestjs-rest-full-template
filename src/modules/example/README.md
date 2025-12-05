# Estructura del Módulo Example

Este módulo sigue la Arquitectura Hexagonal (Puertos y Adaptadores) organizada por capas.

## Estructura de Carpetas

### `domain/`

Contiene la lógica de negocio pura, agnóstica de frameworks y bases de datos.

- **`entities/`**: Modelos de dominio (e.g., `Example.ts`).
- **`repositories/`**: Interfaces (puertos) que definen el contrato de persistencia (e.g., `ExampleRepository.ts`).
- **`exceptions/`**: Excepciones personalizadas del dominio (e.g., `ExampleNotFoundDomainException.ts`).
- **`services/`**: (Opcional) Servicios de dominio para lógica que no pertenece a una sola entidad (e.g., `ExampleDomainService.ts`).

### `application/`

Orquesta la interacción entre el dominio y el mundo exterior.

- **`use-cases/`**: Implementación de casos de uso (e.g., `CreateExampleUseCase.ts`). Utilizan los repositorios (interfaces) del dominio.
- **`dtos/`**: Objetos de Transferencia de Datos para entrada/salida (e.g., `CreateExampleDto.ts`).
- **`mappers/`**: Conversores entre DTOs y Entidades de Dominio.

### `infrastructure/`

Implementaciones concretas de los puertos y adaptadores para frameworks y herramientas externas.

- **`controllers/`**: Adaptadores primarios (REST) que reciben peticiones HTTP (e.g., `ExampleController.ts`).
- **`persistence/`**: Adaptadores secundarios para base de datos.
  - **`repositories/`**: Implementación de las interfaces del dominio usando el ORM (e.g., `ExampleTypeOrmAdapter.ts`).
  - **`entities/`**: (Opcional) Entidades/Schemas específicos del ORM si difieren de las entidades de dominio.
  - **`mappers/`**: Conversores entre entidades de ORM y entidades de Dominio.
