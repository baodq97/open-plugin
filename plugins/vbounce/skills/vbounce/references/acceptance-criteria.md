# Acceptance Criteria Patterns

## GIVEN-WHEN-THEN Format

```gherkin
GIVEN [precondition/context]
WHEN [action/trigger]
THEN [expected outcome]
```

## Examples

### Form Validation
```gherkin
GIVEN I am on the registration form
WHEN I submit with email "invalid-email"
THEN I see error "Please enter a valid email"
AND the form is not submitted
```

### Authentication
```gherkin
GIVEN I am a registered user
WHEN I enter valid credentials and click Login
THEN I am redirected to dashboard
AND I see "Welcome back, [name]"
```

### Error Handling
```gherkin
GIVEN I am uploading a file
WHEN the upload fails due to network error
THEN I see "Upload failed. Please try again."
AND my data is preserved
```

## Rules

✅ **Good AC:**
- Specific and measurable
- Testable (pass/fail)
- User perspective
- One scenario per AC

❌ **Bad AC:**
- Vague ("should be fast")
- Implementation details
- Multiple scenarios mixed
- Untestable statements
