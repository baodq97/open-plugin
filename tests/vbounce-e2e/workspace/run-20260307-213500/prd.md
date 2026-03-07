# PRD: TaskFlow API — Lightweight Task Management Service

**Author**: QA Test Fixture
**Version**: 1.0
**Date**: 2026-03-07
**Status**: Draft

---

## Background

The engineering team needs an internal task management API to replace
spreadsheet-based tracking. The current process is manual, error-prone, and
lacks visibility. Teams waste ~3 hours/week on status update meetings because
there is no single source of truth.

## Problem Statement

Engineers cannot programmatically create, assign, or track tasks. There is no
API to integrate with CI/CD pipelines, Slack bots, or dashboards. Task status
is scattered across Google Sheets, Slack messages, and email threads.

## Proposed Solution

Build a RESTful API service called **TaskFlow** that provides:
- CRUD operations for tasks with assignments and priorities
- Board-based organization (Kanban-style columns)
- Webhook notifications on state changes
- Role-based access control (Admin, Member, Viewer)

---

## Requirements

### Phase 1 — MVP (Target: 2 weeks)

#### F1: Task CRUD

Users can create, read, update, and delete tasks.

- Each task has: title (required, max 200 chars), description (optional, max
  5000 chars), status (todo/in_progress/review/done), priority (P0-P3),
  assignee (user ID), due date (optional), tags (array of strings, max 10).
- Tasks belong to exactly one board.
- Only the task creator or an Admin can delete a task.
- Deleting a task is a soft delete (sets `deleted_at` timestamp).

#### F2: Board Management

Users can organize tasks into boards.

- Each board has: name (required, max 100 chars), description (optional),
  columns (ordered list of status labels, default: todo/in_progress/review/done).
- A board is owned by the user who created it.
- Board owners and Admins can invite members and set their role.
- Boards support custom column names but must always have at least 2 columns.

#### F3: Webhook Notifications

The system sends webhook notifications when task state changes.

- Supported events: task.created, task.updated, task.status_changed,
  task.assigned, task.deleted.
- Webhooks are configured per board (URL + secret for HMAC signing).
- Failed webhook deliveries are retried 3 times with exponential backoff
  (1s, 4s, 16s).
- Webhook payloads include: event type, task snapshot, actor, timestamp.

### Phase 2 — Must Have (Target: 2 weeks after MVP)

#### F4: Search and Filtering

Users can search and filter tasks across boards they have access to.

- Full-text search on title and description.
- Filter by: status, priority, assignee, tags, due date range, board.
- Results are paginated (default 20, max 100 per page).
- Sort by: created_at, updated_at, due_date, priority.

### Phase 3 — Nice to Have

#### F5: Activity Log

Every action on a task is recorded in an immutable activity log.

- Log entries: who did what, when, with before/after values for changes.
- Accessible via API per task or per board.
- Retained for 90 days.

---

## Constraints

- **Tech stack**: Node.js (v20+), Express, PostgreSQL 16, TypeScript
- **Auth**: JWT-based, issued by existing company SSO (external — not built here)
- **Deployment**: Docker container on company Kubernetes cluster
- **API format**: JSON:API specification
- **Rate limiting**: 100 requests/minute per user
- **Database**: Max 10,000 tasks per board

## Success Criteria

- API response time < 200ms at p95 under 50 concurrent users
- 99.5% uptime over first month
- Zero data loss on task mutations
- Webhook delivery success rate > 99% within retry window

## Out of Scope

- Frontend / UI
- Email notifications (only webhooks)
- File attachments
- Real-time subscriptions (WebSocket)
- Multi-tenancy (single organization deployment)
