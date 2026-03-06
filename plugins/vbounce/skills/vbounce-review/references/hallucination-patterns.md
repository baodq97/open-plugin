# Hallucination Detection Patterns

## Known Fake Package Patterns

### npm (JavaScript/TypeScript)
```yaml
fake_patterns:
  - pattern: "*-ai"
    example: "express-validator-ai"
    real_alternative: "express-validator"
    
  - pattern: "*-magic"
    example: "react-magic-state"
    real_alternative: "zustand, redux"
    
  - pattern: "*-auto"
    example: "auto-api-generator"
    real_alternative: "swagger-jsdoc"
    
  - pattern: "easy-*"
    example: "easy-auth"
    real_alternative: "passport"

common_hallucinations:
  - fake: "express-validation-ai"
    real: "express-validator"
  - fake: "prisma-magic"
    real: "prisma"
  - fake: "next-auto-auth"
    real: "next-auth"
```

### NuGet (.NET)

**Verification Commands:**
```bash
# Search NuGet registry
dotnet package search [PackageName] --take 5

# Check specific package via API
curl -s "https://api.nuget.org/v3-flatcontainer/[package-lowercase]/index.json"

# Check package versions
curl -s "https://api.nuget.org/v3-flatcontainer/fluentvalidation/index.json" | grep -o '"[0-9.]*"' | tail -10
```

```yaml
fake_patterns:
  - pattern: "*.Extensions.AI"
    example: "FluentValidation.Extensions.AI"
    real_alternative: "FluentValidation"

  - pattern: "*.Magic"
    example: "EntityFramework.Magic"
    real_alternative: "Microsoft.EntityFrameworkCore"

  - pattern: "*.Auto"
    example: "Dapper.AutoMapper"
    real_alternative: "Dapper + manual mapping or Mapster"

  - pattern: "Microsoft.[NotReal]"
    example: "Microsoft.AutoMapper"
    real_alternative: "AutoMapper"

  - pattern: "System.*.Magic"
    example: "System.Text.Json.Magic"
    real_alternative: "System.Text.Json"

common_hallucinations:
  - fake: "FluentValidation.Extensions.AI"
    real: "FluentValidation (11.x)"
  - fake: "FluentValidation.AutoValidation"
    real: "FluentValidation.AspNetCore"
  - fake: "Microsoft.Extensions.AI"
    real: "Microsoft.Extensions.Hosting"
  - fake: "Dapper.AutoMapper"
    real: "Dapper (2.x) + manual mapping"
  - fake: "Npgsql.AutoMigrate"
    real: "Npgsql (8.x/9.x) + FluentMigrator or DbUp"
  - fake: "BCrypt.Net"
    real: "BCrypt.Net-Next (4.x)"
  - fake: "CsvParser"
    real: "CsvHelper (30.x-33.x)"

verified_real_packages:
  # Data Access
  - name: "Dapper"
    versions: "2.x"
    nuget_id: "dapper"
  - name: "Npgsql"
    versions: "8.x, 9.x"
    nuget_id: "npgsql"
  - name: "Microsoft.EntityFrameworkCore"
    versions: "8.x, 9.x"
    nuget_id: "microsoft.entityframeworkcore"

  # Validation
  - name: "FluentValidation"
    versions: "11.x"
    nuget_id: "fluentvalidation"
  - name: "FluentValidation.AspNetCore"
    versions: "11.x"
    nuget_id: "fluentvalidation.aspnetcore"

  # Authentication
  - name: "Microsoft.AspNetCore.Authentication.JwtBearer"
    versions: "8.x, 9.x, 10.x"
    nuget_id: "microsoft.aspnetcore.authentication.jwtbearer"
  - name: "BCrypt.Net-Next"
    versions: "4.x"
    nuget_id: "bcrypt.net-next"

  # Utilities
  - name: "CsvHelper"
    versions: "30.x-33.x"
    nuget_id: "csvhelper"
  - name: "Serilog"
    versions: "3.x, 4.x"
    nuget_id: "serilog"
  - name: "AutoMapper"
    versions: "12.x, 13.x"
    nuget_id: "automapper"
```

**Fake .NET Methods/APIs:**
```yaml
fake_dotnet_apis:
  entity_framework:
    fake:
      - "DbContext.AutoMigrate()"
      - "DbSet<T>.BulkInsertAsync()"
      - "DbContext.SaveChangesWithValidation()"
    real:
      - "Database.Migrate() or Database.EnsureCreated()"
      - "AddRange() + SaveChangesAsync() or EFCore.BulkExtensions"
      - "SaveChangesAsync() with FluentValidation"

  aspnetcore:
    fake:
      - "IServiceCollection.AddAutoServices()"
      - "app.UseAutoMiddleware()"
      - "HttpContext.GetUserAsync()"
    real:
      - "IServiceCollection.AddScoped/AddTransient/AddSingleton"
      - "app.UseMiddleware<T>()"
      - "HttpContext.User with ClaimsPrincipal"

  httpclient:
    fake:
      - "HttpClient.PostJsonAsync<T>()"
      - "HttpClient.GetAsync<T>()"
    real:
      - "HttpClient.PostAsJsonAsync() (from System.Net.Http.Json)"
      - "HttpClient.GetFromJsonAsync<T>()"

  dapper:
    fake:
      - "connection.QueryAutoAsync<T>()"
      - "connection.ExecuteWithTransaction()"
    real:
      - "connection.QueryAsync<T>()"
      - "connection.Execute() with IDbTransaction"
```

**Fake .NET Attributes:**
```yaml
fake_attributes:
  - "[AutoValidate]"
  - "[MagicRoute]"
  - "[AutoInject]"
  - "[ValidateModel]"  # Invented - use [ApiController] + FluentValidation
  - "[AutoAuthorize]"  # Invented - use [Authorize]

real_attributes:
  - "[ApiController]"
  - "[Route]", "[HttpGet]", "[HttpPost]"
  - "[Authorize]", "[AllowAnonymous]"
  - "[FromBody]", "[FromQuery]", "[FromRoute]"
  - "[Required]", "[MaxLength]", "[Range]"
```

### PyPI (Python)
```yaml
fake_patterns:
  - pattern: "auto-*"
    example: "auto-django"
    real_alternative: "django"
    
  - pattern: "*-ai"
    example: "flask-ai"
    real_alternative: "flask"
    
  - pattern: "magic-*"
    example: "magic-sqlalchemy"
    real_alternative: "sqlalchemy"

common_hallucinations:
  - fake: "django-magic-forms"
    real: "django-crispy-forms"
  - fake: "auto-fastapi"
    real: "fastapi"
```

## Known Fake API Patterns

### Methods That Don't Exist
```yaml
prisma:
  fake:
    - "prisma.user.findManyAndCount()"
    - "prisma.user.createMany({ skipDuplicates: true }).count()"
  real:
    - "prisma.user.findMany() + prisma.user.count()"
    - "prisma.user.createMany({ skipDuplicates: true })"

express:
  fake:
    - "express.json({ autoValidate: true })"
    - "app.useAsync()"
  real:
    - "express.json()"
    - "app.use() with async wrapper"

mongoose:
  fake:
    - "Model.findAndModify()"
    - "Model.bulkUpsert()"
  real:
    - "Model.findOneAndUpdate()"
    - "Model.bulkWrite()"
```

### Configuration Options That Don't Exist
```yaml
jwt:
  fake:
    - "{ autoRefresh: true }"
    - "{ validatePayload: true }"
  real:
    - "Manual refresh implementation"
    - "Custom validation in verify callback"

nestjs:
  fake:
    - "@AutoValidate()"
    - "@MagicGuard()"
  real:
    - "@UsePipes(ValidationPipe)"
    - "@UseGuards(AuthGuard)"
```

## Verification Checklist

Before approving implementation:

- [ ] All package names verified against registry
- [ ] All package versions exist
- [ ] All imported methods exist in package docs
- [ ] All decorator/attribute names verified
- [ ] All configuration options verified
- [ ] No "too convenient" patterns used

## Red Flags

If you see ANY of these, investigate immediately:

1. **Package name includes "AI", "Magic", "Auto"** - 90% chance hallucination
2. **Method does exactly what you'd want** - May be invented
3. **Configuration option not in docs** - Likely hallucination
4. **Decorator/attribute with convenient name** - Verify exists
5. **CLI flag that seems too helpful** - Check --help output
