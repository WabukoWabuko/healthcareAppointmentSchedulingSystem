# Design Decisions for Healthcare Appointment Scheduling System

## Overview
This document outlines the key design decisions made during the development of the Healthcare Appointment Scheduling System, focusing on architecture, security, and performance.

## Backend Architecture
- **Framework Choice**: We chose Django with Django REST Framework (DRF) for the backend due to its robust ecosystem, built-in ORM, and support for rapid development. DRF provides powerful tools for building RESTful APIs, including serializers and viewsets.
- **App Structure**: The project is divided into modular apps (`users`, `patients`, `doctors`, `appointments`, `medical_records`) to ensure separation of concerns and maintainability. Each app contains models, serializers, views, and tests.
- **Database**: SQLite was used for development due to its simplicity, but the schema is designed to be compatible with PostgreSQL for production (e.g., using appropriate field types and relationships).

## API Design
- **RESTful Principles**: Followed RESTful conventions for API endpoints (e.g., `/api/doctors/` for listing doctors, `/api/appointments/` for managing appointments). Used HTTP methods appropriately (GET for retrieval, POST for creation, etc.).
- **Documentation**: Used `drf-spectacular` to generate Swagger/OpenAPI documentation, providing a user-friendly interface for developers to explore the API.

## Data Modeling
- **Relationships**: Designed a relational schema with foreign key relationships (e.g., `Appointment` links to `Patient` and `Doctor`, `MedicalRecord` links to `Appointment`). This ensures referential integrity.
- **Validation**: Implemented validation at the serializer level (e.g., `AppointmentSerializer` checks doctor availability and prevents conflicts).

## Security Implementation
- **Authentication**: Used JWT (JSON Web Tokens) via `djangorestframework-simplejwt` for stateless authentication. Users obtain a token pair (access and refresh) via `/api/auth/jwt/token/`.
- **Authorization**: Implemented role-based access control with three roles: `patient`, `doctor`, and `admin`. Each viewset’s `get_queryset` method filters data based on the user’s role (e.g., patients can only see their own appointments).
- **Sensitive Data**: Medical records are protected by role-based access (patients can only view their own records, doctors can update records for their patients). No sensitive data (e.g., passwords) is exposed in API responses.
- **Improvements**: In a production environment, we would add HTTPS, rate limiting, and input sanitization to further secure the API.

## Performance Optimizations
- **Asynchronous Processing**: Used Celery with Redis to handle time-consuming tasks (e.g., sending email notifications after booking an appointment) asynchronously.
- **Caching**: Implemented caching with Redis for frequently accessed data (e.g., doctor availability) to reduce database load.
- **Indexing**: Added database indexes on frequently queried fields (e.g., `doctor_id` and `datetime` in `Appointment`) to improve query performance.

## Testing
- **Unit Tests**: Wrote unit tests for models and serializers to ensure core business logic works as expected.
- **Integration Tests**: Created API integration tests to verify endpoint functionality, including authentication and authorization.

## Challenges and Trade-offs
- **SQLite vs. PostgreSQL**: Chose SQLite for development to simplify setup, but this limits concurrency in production. PostgreSQL would be used in a production environment.
- **Performance vs. Complexity**: Added caching and asynchronous processing, but avoided over-optimization (e.g., complex query optimizations) to keep the codebase maintainable for the challenge’s scope.
