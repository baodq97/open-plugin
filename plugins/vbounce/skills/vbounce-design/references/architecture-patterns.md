# Architecture Patterns

## Styles

### Monolith
```
┌─────────────────────┐
│    Application      │
├─────────────────────┤
│ UI │ Logic │ Data   │
└─────────────────────┘
         │
    ┌────────┐
    │   DB   │
    └────────┘
```
**Use when:** Small team, simple domain, quick MVP

### Microservices
```
┌───────┐ ┌───────┐ ┌───────┐
│Svc A  │ │Svc B  │ │Svc C  │
└───┬───┘ └───┬───┘ └───┬───┘
    ▼         ▼         ▼
┌────┐    ┌────┐    ┌────┐
│DB A│    │DB B│    │DB C│
└────┘    └────┘    └────┘
```
**Use when:** Large teams, independent scaling, complex domain

### Modular Monolith
Best of both: Clear boundaries, single deployment

## Design Patterns

### Repository
```typescript
interface IUserRepository {
  findById(id: string): Promise<User | null>;
  save(user: User): Promise<User>;
}
```

### Service Layer
```typescript
class UserService {
  constructor(private repo: IUserRepository) {}
  
  async createUser(data: CreateUserDto) {
    // Business logic
    return this.repo.save(new User(data));
  }
}
```

## API Patterns

### REST Resources
```
GET    /users         # List
GET    /users/{id}    # Get
POST   /users         # Create
PUT    /users/{id}    # Update
DELETE /users/{id}    # Delete
```

### Versioning
```
/api/v1/users
/api/v2/users
```
