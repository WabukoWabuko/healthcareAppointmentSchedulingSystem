# Security Approach for Healthcare Appointment Scheduling System

## Overview
This document outlines the security measures implemented in the healthcare appointment scheduling system to protect sensitive data and ensure proper access control.

## Authentication
- **Mechanism**: JSON Web Tokens (JWT) using `djangorestframework-simplejwt`.
- **Implementation**:
  - Users authenticate via the `/api/auth/jwt/create/` endpoint by providing their email and password.
  - A JWT access token is returned, which must be included in the `Authorization` header (`Bearer <token>`) for all authenticated requests.
  - Tokens have a short lifespan (configurable, default 5 minutes), and refresh tokens are used to obtain new access tokens.
- **Purpose**: Ensures only authenticated users can access the API.

## Authorization (Role-Based Access Control)
- **Roles**: The system defines three roles: `patient`, `doctor`, and `admin`.
- **Implementation**:
  - Each user has a `role` field in the `CustomUser` model.
  - Role-based access is enforced in the `get_queryset()` method of each viewset:
    - **Patients**: Can only see their own data (e.g., appointments, medical records).
    - **Doctors**: Can only see data related to their appointments (e.g., their availability, appointments, medical records).
    - **Admins**: Have full access to all data.
  - Custom permission classes (e.g., `MedicalRecordPermission`) are used to enforce more granular access:
    - Patients have read-only access to their own medical records.
    - Doctors can create, update, and delete medical records for their appointments.
    - Admins have full access to all medical records.

## Data Security
- **Sensitive Data**:
  - Patient information (e.g., `insurance_id`, medical records) is considered sensitive.
  - Medical records are only accessible to authorized users (patients for their own records, doctors for their appointments, admins for all records).
- **Database Security**:
  - Referential integrity is maintained using foreign keys (e.g., `patient` and `doctor` in `Appointment`).
  - No encryption is currently implemented for data at rest (future improvement: consider encrypting sensitive fields like `insurance_id`).
- **API Security**:
  - All endpoints require authentication (`IsAuthenticated` permission).
  - CORS is configured to allow only trusted origins (currently `http://localhost:3000` for development).

## Future Improvements
- **HTTPS**: Deploy the API with HTTPS to encrypt data in transit.
- **Data Encryption**: Encrypt sensitive fields (e.g., `insurance_id`, medical record details) in the database.
- **Audit Logging**: Add logging for sensitive actions (e.g., viewing or updating medical records).
- **Rate Limiting**: Implement rate limiting to prevent abuse of the API.

## Conclusion
The system uses JWT for authentication, role-based access control for authorization, and custom permissions to protect sensitive data like medical records. While the current implementation meets basic security requirements, additional measures (e.g., encryption, audit logging) can be added to further enhance security.
