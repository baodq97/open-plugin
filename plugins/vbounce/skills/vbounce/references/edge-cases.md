# Edge Cases Checklist

## Inputs

### Strings
| Case | Value | Test |
|------|-------|------|
| Empty | `""` | Handle gracefully |
| Whitespace | `"   "` | Trim or reject |
| Long | 10K+ chars | Check limits |
| Unicode | `"日本語"` | Encoding |
| XSS | `"<script>"` | Sanitize |
| SQL | `"'; DROP"` | Parameterize |

### Numbers
| Case | Value | Test |
|------|-------|------|
| Zero | `0` | Division |
| Negative | `-1` | Validation |
| Max int | `2147483647` | Overflow |
| Decimal | `0.1 + 0.2` | Precision |

### Arrays
| Case | Value | Test |
|------|-------|------|
| Empty | `[]` | Empty state |
| Single | `[1]` | Edge iteration |
| Large | 10K+ items | Performance |

### Dates
| Case | Value | Test |
|------|-------|------|
| Epoch | `1970-01-01` | Min date |
| Future | `2099-12-31` | Max date |
| Leap year | `2024-02-29` | Validity |
| DST | `2023-03-12T02:30` | Timezone |

## State

### Concurrency
- Two users edit same resource
- Read during write
- Simultaneous creates

### Timing
- Request timeout
- Network delay
- Retry mid-operation

### Resources
- Disk full
- Memory limit
- Connection pool exhausted

## Business Logic
- Boundary conditions
- Permission edge cases
- Pagination limits
