# Password Reset Specification

## Purpose
Provide a secure web-based interface for users to reset their account passwords after a "Forgot Password" request in the mobile app.

## Scope
- Password validation rules.
- Password reset form interaction.
- Backend API communication.

## Definitions
- **Token**: A unique, time-limited string sent to the user via email to authorize the password change.

## User Flow
1. User receives an email with a link to `https://guiabrecho.com.br/reset-password/[token]`.
2. User enters a new password and confirms it.
3. System validates the password against predefined rules.
4. System displays password strength.
5. User submits the form.
6. System communicates with the backend API.
7. System displays success or error feedback.

## Password Validation Rules
The password must satisfy ALL of the following conditions:
- **Length**: Minimum of 6 characters.
- **Complexity**:
    - At least 1 uppercase letter (`[A-Z]`).
    - At least 1 number (`[0-9]`).
    - At least 1 special character (any non-alphanumeric character).

## Inputs & Outputs

### Inputs
- `token` (from URL parameter).
- `password` (from user input).
- `confirm` (from user input).

### Outputs
- **POST** to `${API_BASE}/auth/reset-password`:
    - Body: `{ token: string, password: string }`
    - Success Response: `2xx` status code.
    - Error Response: `4xx/5xx` status code with optional `{ message: string }`.

## Expected Behavior
- **Show/Hide Toggle**: Users can toggle the visibility of the password and confirmation fields to verify their input.
- **Strength Meter**: Updates in real-time as the user types.
    - 0-2 rules met: "Fraca" (Weak).
    - 3 rules met: "Boa" (Good).
    - 4 rules met: "Forte" (Strong).
- **Form Locking**: The form fields and submit button are disabled while the request is in progress or after a successful reset.
- **Error Handling**:
    - If passwords do not match: "As senhas nao coincidem."
    - If validation fails: Display the specific rule that failed.
    - Backend error: Display the error message from the API or a generic fallback.

## Invariants
- The token must be passed exactly as received in the URL to the API.
- Password validation logic must match between the web client and the mobile app (shared logic).

## Open Questions
- Is there a token expiration time displayed to the user? (Currently not in code).
- Should the user be redirected back to the landing page after a successful reset? (Currently stays on success message).
