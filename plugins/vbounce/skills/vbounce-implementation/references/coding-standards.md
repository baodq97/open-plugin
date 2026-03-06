# Coding Standards

## Naming

| Type | Convention | Example |
|------|------------|---------|
| Classes | PascalCase | `UserService` |
| Methods | camelCase | `getUserById` |
| Variables | camelCase | `userId` |
| Constants | UPPER_SNAKE | `MAX_RETRY` |
| Files | kebab-case | `user-service.ts` |

## Structure

- **Max file:** 500 lines
- **Max function:** 50 lines
- **Max complexity:** 10

## Documentation

```typescript
/**
 * Creates a new user.
 * @param data - User creation data
 * @returns Created user
 * @throws ValidationError if email invalid
 */
async function createUser(data: CreateUserDto): Promise<User>
```

## Error Handling

```typescript
// ✅ Good - typed errors
throw new ValidationError('Invalid email');
throw new NotFoundError('User not found');

// ❌ Bad - generic
throw new Error('Something went wrong');
```

## Security

- [ ] Validate all inputs
- [ ] Never log passwords/tokens
- [ ] Use parameterized queries
- [ ] Escape HTML output
- [ ] Check permissions before actions
