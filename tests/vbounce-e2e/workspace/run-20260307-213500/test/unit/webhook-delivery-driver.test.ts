import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { WebhookDeliveryDriver } from '../../src/interface/webhook/webhook-delivery-driver.js';

describe('WebhookDeliveryDriver', () => {
  // T-NFR-002-003: Webhook HMAC signature verification
  describe('HMAC signature', () => {
    it('should compute correct HMAC-SHA256 signature', () => {
      const secret = 'test-secret';
      const payload = JSON.stringify({ event: 'task.created', data: {} });

      const expected = crypto.createHmac('sha256', secret).update(payload).digest('hex');
      const actual = WebhookDeliveryDriver.computeSignature(secret, payload);

      assert.equal(actual, expected);
    });

    it('should produce different signatures for different secrets', () => {
      const payload = JSON.stringify({ event: 'task.created' });

      const sig1 = WebhookDeliveryDriver.computeSignature('secret-1', payload);
      const sig2 = WebhookDeliveryDriver.computeSignature('secret-2', payload);

      assert.notEqual(sig1, sig2);
    });
  });

  // SSRF protection (STR-WHD-D01)
  describe('SSRF protection', () => {
    it('should block localhost URLs', () => {
      assert.equal(WebhookDeliveryDriver.isPrivateUrl('https://127.0.0.1/hook'), true);
    });

    it('should block 10.x.x.x URLs', () => {
      assert.equal(WebhookDeliveryDriver.isPrivateUrl('https://10.0.0.1/hook'), true);
    });

    it('should block 172.16.x.x URLs', () => {
      assert.equal(WebhookDeliveryDriver.isPrivateUrl('https://172.16.0.1/hook'), true);
    });

    it('should block 192.168.x.x URLs', () => {
      assert.equal(WebhookDeliveryDriver.isPrivateUrl('https://192.168.1.1/hook'), true);
    });

    it('should block 169.254.x.x (link-local) URLs', () => {
      assert.equal(WebhookDeliveryDriver.isPrivateUrl('https://169.254.169.254/latest'), true);
    });

    it('should allow valid external URLs', () => {
      assert.equal(WebhookDeliveryDriver.isPrivateUrl('https://example.com/hook'), false);
    });
  });
});
