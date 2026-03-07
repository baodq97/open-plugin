import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { CreateTaskSchema } from '../../src/application/dto/create-task.dto.js';
import { UpdateTaskSchema } from '../../src/application/dto/update-task.dto.js';
import { CreateBoardSchema } from '../../src/application/dto/create-board.dto.js';
import { InviteMemberSchema } from '../../src/application/dto/invite-member.dto.js';
import { CreateWebhookSchema } from '../../src/application/dto/create-webhook.dto.js';

describe('Validation Schemas', () => {
  describe('CreateTaskSchema', () => {
    // T-AC-US-001-001-02: Reject task creation without title
    it('should reject payload without title', () => {
      const result = CreateTaskSchema.safeParse({
        data: { type: 'tasks', attributes: { status: 'todo', priority: 'P1' } },
      });
      assert.equal(result.success, false);
    });

    // T-AC-US-001-001-03: Reject task creation with title exceeding 200 chars
    it('should reject title exceeding 200 characters', () => {
      const result = CreateTaskSchema.safeParse({
        data: { type: 'tasks', attributes: { title: 'a'.repeat(201) } },
      });
      assert.equal(result.success, false);
      if (!result.success) {
        const msg = result.error.errors[0].message;
        assert.match(msg, /200/);
      }
    });

    // T-AC-US-001-001-01: Accept valid task payload
    it('should accept valid task payload', () => {
      const result = CreateTaskSchema.safeParse({
        data: {
          type: 'tasks',
          attributes: { title: 'Fix login bug', status: 'todo', priority: 'P1' },
        },
      });
      assert.equal(result.success, true);
    });

    // T-AC-US-001-001-05: Reject task creation with more than 10 tags
    it('should reject more than 10 tags', () => {
      const tags = Array.from({ length: 11 }, (_, i) => `t${i}`);
      const result = CreateTaskSchema.safeParse({
        data: { type: 'tasks', attributes: { title: 'Test', tags } },
      });
      assert.equal(result.success, false);
    });

    it('should accept exactly 10 tags', () => {
      const tags = Array.from({ length: 10 }, (_, i) => `t${i}`);
      const result = CreateTaskSchema.safeParse({
        data: { type: 'tasks', attributes: { title: 'Test', tags } },
      });
      assert.equal(result.success, true);
    });

    // T-AC-US-001-003-02: Reject invalid status
    it('should reject invalid status enum', () => {
      const result = CreateTaskSchema.safeParse({
        data: { type: 'tasks', attributes: { title: 'Test', status: 'invalid_status' } },
      });
      assert.equal(result.success, false);
    });
  });

  describe('UpdateTaskSchema', () => {
    // T-AC-US-001-003-04: Accept description at max length (5000 chars)
    it('should accept description at exactly 5000 characters', () => {
      const result = UpdateTaskSchema.safeParse({
        data: { type: 'tasks', attributes: { description: 'a'.repeat(5000) } },
      });
      assert.equal(result.success, true);
    });

    it('should reject description exceeding 5000 characters', () => {
      const result = UpdateTaskSchema.safeParse({
        data: { type: 'tasks', attributes: { description: 'a'.repeat(5001) } },
      });
      assert.equal(result.success, false);
    });
  });

  describe('CreateBoardSchema', () => {
    // T-AC-US-002-001-02: Reject board creation without name
    it('should reject payload without name', () => {
      const result = CreateBoardSchema.safeParse({
        data: { type: 'boards', attributes: {} },
      });
      assert.equal(result.success, false);
    });

    // T-AC-US-002-001-03: Reject board name exceeding 100 chars
    it('should reject name exceeding 100 characters', () => {
      const result = CreateBoardSchema.safeParse({
        data: { type: 'boards', attributes: { name: 'a'.repeat(101) } },
      });
      assert.equal(result.success, false);
    });

    // T-AC-US-002-001-04: Create board with custom 2-column layout
    it('should accept 2-column layout', () => {
      const result = CreateBoardSchema.safeParse({
        data: { type: 'boards', attributes: { name: 'Test', columns: ['open', 'closed'] } },
      });
      assert.equal(result.success, true);
    });

    // T-AC-US-002-001-05: Reject board with fewer than 2 columns
    it('should reject fewer than 2 columns', () => {
      const result = CreateBoardSchema.safeParse({
        data: { type: 'boards', attributes: { name: 'Test', columns: ['only_one'] } },
      });
      assert.equal(result.success, false);
    });
  });

  describe('InviteMemberSchema', () => {
    // T-AC-US-002-003-02: Reject invalid role on invite
    it('should reject invalid role', () => {
      const result = InviteMemberSchema.safeParse({
        data: {
          type: 'board-members',
          attributes: { user_id: '550e8400-e29b-41d4-a716-446655440000', role: 'SuperAdmin' },
        },
      });
      assert.equal(result.success, false);
    });

    it('should accept valid invite payload', () => {
      const result = InviteMemberSchema.safeParse({
        data: {
          type: 'board-members',
          attributes: { user_id: '550e8400-e29b-41d4-a716-446655440000', role: 'Member' },
        },
      });
      assert.equal(result.success, true);
    });
  });

  describe('CreateWebhookSchema', () => {
    // T-AC-US-003-001-02: Reject invalid webhook URL
    it('should reject non-HTTPS URL', () => {
      const result = CreateWebhookSchema.safeParse({
        data: {
          type: 'webhooks',
          attributes: { url: 'http://example.com/hook', secret: 'my-secret-key-is-long' },
        },
      });
      assert.equal(result.success, false);
    });

    it('should reject invalid URL', () => {
      const result = CreateWebhookSchema.safeParse({
        data: {
          type: 'webhooks',
          attributes: { url: 'not-a-valid-url', secret: 'my-secret-key-is-long' },
        },
      });
      assert.equal(result.success, false);
    });

    it('should accept valid HTTPS URL', () => {
      const result = CreateWebhookSchema.safeParse({
        data: {
          type: 'webhooks',
          attributes: { url: 'https://example.com/hook', secret: 'my-secret-key-is-long-enough' },
        },
      });
      assert.equal(result.success, true);
    });
  });
});
