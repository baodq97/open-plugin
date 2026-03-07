import crypto from 'node:crypto';

export interface WebhookDeliveryPayload {
  delivery_id: string;
  event: string;
  timestamp: string;
  actor: { user_id: string };
  data: Record<string, unknown>;
}

export interface DeliveryResult {
  success: boolean;
  statusCode: number | null;
  error: string | null;
}

/**
 * Delivers webhook payloads to external URLs with HMAC-SHA256 signing.
 * Implements SSRF protection by blocking private IP ranges.
 */
export class WebhookDeliveryDriver {
  private static readonly PRIVATE_IP_PATTERNS = [
    /^127\./,                       // loopback
    /^10\./,                        // 10.0.0.0/8
    /^172\.(1[6-9]|2\d|3[01])\./,  // 172.16.0.0/12
    /^192\.168\./,                  // 192.168.0.0/16
    /^169\.254\./,                  // link-local
    /^0\./,                         // 0.0.0.0/8
    /^::1$/,                        // IPv6 loopback
    /^fc00:/,                       // IPv6 unique local
    /^fe80:/,                       // IPv6 link-local
  ];

  static computeSignature(secret: string, payload: string): string {
    return crypto.createHmac('sha256', secret).update(payload).digest('hex');
  }

  static isPrivateUrl(url: string): boolean {
    try {
      const parsed = new URL(url);
      const hostname = parsed.hostname;
      return WebhookDeliveryDriver.PRIVATE_IP_PATTERNS.some((pattern) => pattern.test(hostname));
    } catch {
      return true; // Reject invalid URLs
    }
  }

  async deliver(
    url: string,
    payload: WebhookDeliveryPayload,
    secret: string,
    timeoutMs: number = 5000,
  ): Promise<DeliveryResult> {
    if (WebhookDeliveryDriver.isPrivateUrl(url)) {
      return { success: false, statusCode: null, error: 'SSRF: URL resolves to private IP range' };
    }

    const body = JSON.stringify(payload);
    const signature = WebhookDeliveryDriver.computeSignature(secret, body);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Signature-256': `sha256=${signature}`,
          'X-Delivery-Id': payload.delivery_id,
          'X-Event-Type': payload.event,
          'User-Agent': 'TaskFlow-Webhook/1.0',
        },
        body,
        signal: AbortSignal.timeout(timeoutMs),
      });

      return {
        success: response.ok,
        statusCode: response.status,
        error: response.ok ? null : `HTTP ${response.status}`,
      };
    } catch (err) {
      return {
        success: false,
        statusCode: null,
        error: err instanceof Error ? err.message : 'Unknown delivery error',
      };
    }
  }
}
