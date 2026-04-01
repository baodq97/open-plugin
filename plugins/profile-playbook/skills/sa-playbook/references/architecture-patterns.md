# Common Architecture Patterns

Reference guide for evaluating trade-offs during the Design phase. Each pattern includes a YAGNI-first analysis: start simple, upgrade when needed.

---

## 1. Deployment: Monolith vs Microservices

### When to choose what

| Criteria | Flexible Monolith | Microservices | Queue-based hybrid |
|----------|-------------------|---------------|-------------------|
| Team size | 1-5 people | 5+ independent teams | 2-3 teams |
| Users | < 500 | > 1000 | 100-1000 |
| Ops capacity | 1-2 people | DevOps team | 2-3 people |
| Best suited for | MVP, startup, small team | Large org, diverse tech stacks | Independent processing at scale |

### YAGNI recommendation

**Start with:** Flexible Monolith — clear code boundaries (separate modules/packages), single-process deployment.

**Upgrade path:** When bottleneck occurs → add message queue → extract heavy modules into separate workers. No rewrite needed if code boundaries are already clean.

**Trigger to split:** SSE timeout, concurrent processing exceeds capacity, team growth requires deploy independence.

---

## 2. Data Isolation: RLS vs Schema vs Dedicated DB

### When to choose what

| Criteria | Row-Level Security (RLS) | Schema-per-tenant | Dedicated DB |
|----------|-------------------------|-------------------|-------------|
| Isolation strength | Weak (1 bug = data leak) | Strong | Very strong |
| Complexity | Low | Medium | High |
| Migration path | Difficult (restructure) | Easy (pg_dump) | N/A |
| Solo ops feasibility | OK | OK | Difficult |
| Enterprise trust | Low | Acceptable | High |

### YAGNI recommendation

**Start with:** Schema-per-tenant — sufficient isolation for enterprise, easy to upgrade.

**Upgrade path:** `pg_dump --schema=tenant_X` → dedicated database. Update connection config, no code changes needed.

**Avoid:** Building tiered isolation (all 3 levels) for V1 — 3 code paths = 3x testing, 3x ops complexity.

---

## 3. Knowledge Management: Clone vs Reference vs Real-time Sync

### When to choose what

| Criteria | Clone + Selective Sync | Reference + ACL | Real-time Sync |
|----------|----------------------|-----------------|----------------|
| Isolation | Strong (separate copy) | Weak (shared access) | Weak |
| Data freshness | Requires manual sync | Always current | Always current |
| Security risk | Low (no hub access) | High (ACL bug = leak) | High |
| Runtime stability | High (unaffected by changes) | Medium | Low (unexpected changes) |
| Complexity | Medium (sync mechanism) | High (ACL system) | Very high |

### YAGNI recommendation

**Start with:** Clone + selective sync — isolation by design, no ACL system needed.

**Principle:** Stability > immediacy for production workflows. A running agent should not break due to a knowledge hub change.

**Sync flow:** Hub changes → notify owner → owner reviews → selective sync → rollback possible.

---

## 4. Access Control: Restricted vs Open + Guardrails

Pattern for self-service tools (e.g., agent builder).

### When to choose what

| Criteria | Admin/IT only | Admin + PO | Open to all |
|----------|-------------|-----------|---------------|
| Adoption speed | Slow (IT bottleneck) | Medium | Fast |
| Quality risk | Low | Medium | High |
| DX target | Does not achieve self-service | Partial | < 30 minutes |
| Scale | Limited by IT capacity | Better | Self-service |

### YAGNI recommendation

**If targeting self-service:** Open to all + AI guardrails. Tool suggests → human reviews → deploy.

**Mitigating quality risk:**
- AI recommends (no blind creation)
- Review/approve step before deploy
- Admin can disable any agent at any time
- Automatic token budget limits

---

## 5. Config Storage: Filesystem vs DB vs Hybrid

### When to choose what

| Criteria | Filesystem only | DB only | Hybrid |
|----------|----------------|---------|--------|
| DX (developer edit) | Best (IDE + Git) | Requires admin UI | Good (templates on fs) |
| Multi-tenant | No | Yes | Yes |
| Versioning | Git (natural) | Migration | Git (templates) + DB (instances) |
| Marketplace future | Difficult | Ready | Ready |

### YAGNI recommendation

**Start with:** Hybrid — filesystem for platform templates (git-versioned), DB for tenant instances.

**Marketplace path:** Templates on filesystem → marketplace listings. Install = clone into tenant DB. No need to build separate marketplace infra for V1.

---

## 6. Builder-Runner Pattern

A specialized pattern for AI agent platforms: separating "agent creation" and "agent execution" into 2 distinct concerns.

### Architecture

```
Knowledge Hub (all knowledge)
        │ FULL READ ACCESS
        ▼
   Agent Builder (Super Agent)
   - Reads entire hub
   - Suggests knowledge subset + tools
   - Human reviews
   - Generates agent package
        │ PRODUCES
        ▼
   Serving Agents (Runner)
   - Reads only its own knowledge copy
   - No hub access
   - Task-oriented workspace
   - Layout + tickets + human interaction
```

### When to use

- Platform has extensive domain knowledge that needs to be distributed to specialized agents
- Least-privilege required: serving agent must not exceed its permissions
- Target: non-technical users can also create agents
- Knowledge must be isolated per agent (no cross-agent sharing)

### Trade-offs

| Benefit | Cost |
|---------|------|
| Least privilege (serving agent sandboxed) | Builder requires full hub access (security surface) |
| Self-service agent creation | Quality control for agent output |
| Knowledge isolation | Stale data (requires sync mechanism) |
| Good DX (natural language → agent) | Complex builder agent |

---

## General Principles: YAGNI-First Architecture

### Questions before every decision

1. **Scale test:** "Given the current number of users, is this needed?"
2. **Ops test:** "Given the current ops team, can this be operated?"
3. **Upgrade test:** "If an upgrade is needed later, is it straightforward?"
4. **6-month test:** "If scale remains unchanged for 6 months, does this still make sense?"

### Pattern

```
Design for separation → Deploy simply → Document the upgrade path
       (code)            (deployment)           (ADR)
```

Do not build for the future. Build a clean foundation that the future can build upon.
