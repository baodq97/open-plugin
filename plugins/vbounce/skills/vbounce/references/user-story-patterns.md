# User Story Patterns

## Format
```
As a [user type],
I want [action],
So that [benefit].
```

## Templates by Category

### Authentication
```yaml
- as_a: "visitor"
  i_want: "create an account"
  so_that: "I can access personalized features"

- as_a: "registered user"
  i_want: "reset my password"
  so_that: "I can regain access if forgotten"
```

### CRUD
```yaml
- as_a: "[user type]"
  i_want: "create a new [resource]"
  so_that: "I can [business value]"

- as_a: "[user type]"
  i_want: "view list of [resources]"
  so_that: "I can find what I need"
```

### Search/Filter
```yaml
- as_a: "[user type]"
  i_want: "search [resources] by [criteria]"
  so_that: "I can quickly find specific items"
```

## Story Points

| Points | Complexity | Time |
|--------|------------|------|
| 1 | Trivial | < 2h |
| 2 | Simple | 2-4h |
| 3 | Moderate | 4-8h |
| 5 | Complex | 1-2d |
| 8 | Very Complex | 2-3d |
| 13 | Epic | Split it |

## Priority

- **P0**: Blocks release
- **P1**: MVP requirement
- **P2**: Enhances value
- **P3**: Nice to have
