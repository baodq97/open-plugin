# Ambiguity Checklist

## Vague Terms to Flag

| Term | Question | Example Clarification |
|------|----------|----------------------|
| "fast" | Target response time? | < 200ms API, < 2s page |
| "quick" | Acceptable latency? | < 100ms perceived |
| "easy" | How many steps? | < 5 clicks |
| "many" | Exact count? | Up to 100 items |
| "several" | What range? | 3-10 items |
| "secure" | What standards? | OWASP Top 10 |
| "scalable" | Target load? | 10K concurrent |
| "user-friendly" | What criteria? | 90% task completion |

## Implicit Requirements

### Security (usually unstated)
- Authentication method?
- Authorization rules?
- Data encryption?
- Audit logging?

### Performance (often assumed)
- Response time targets?
- Concurrent users?
- Data volume?

### Error Handling (often forgotten)
- Error message format?
- Retry logic?
- Timeout handling?

## Question Templates

```
"For [feature], what are the limits?
- Minimum: ___
- Maximum: ___
- Default: ___"

"When [condition] occurs, what should happen?
- Success: ___
- Failure: ___
- Edge case: ___"
```

## Default Assumptions

Document when clarification unavailable:

```yaml
defaults:
  file_upload:
    max_size: "5MB"
    types: ["jpg", "png", "pdf"]
  pagination:
    page_size: 20
    max_size: 100
  session:
    timeout: "30 minutes"
```
