# Pending Decisions & TODOs

## Purpose
Track identified gaps, placeholders, and technical debts found in the codebase that require resolution for the system to be considered "final."

## Branding & Identity
- [ ] **Brand Name**: Currently hardcoded as "Guia Brechó", but marked with `TODO: replace with final brand name` in `app/page.tsx`.
- [ ] **Tagline**: Currently "Descubra brechós perto de você", but marked with `TODO: replace with final tagline` in `app/page.tsx`.
- [ ] **Favicon**: No custom favicon or apple-touch-icon is currently present in the `app/` or `public/` directories.

## Functional Improvements
- [ ] **Post-Reset Redirect**: After a successful password reset, the user is shown a success message but not automatically redirected to the landing page or a "deep link" back to the app.
- [ ] **Token Expiration**: The UI does not currently communicate or handle token expiration states before the user attempts a submission.
- [ ] **API Base URL Fallback**: The system defaults to `http://localhost:8080` if no environment variables or constants are found. This may not be desired in a production-like staging environment.

## Technical Debt
- [ ] **Code Duplication**: The `passwordRules` mapping for the `rulesHint` string is repeated in both `app/reset-password/[token]/page.tsx` and `app/reset-password/[token]/ResetPasswordForm.tsx`.
- [ ] **Error Handling**: Many fetch operations use a generic "Nao foi possivel..." message if the specific API error message is missing.
