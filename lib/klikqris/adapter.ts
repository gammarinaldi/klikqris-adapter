import axios from 'axios';
import { KlikQrisCreatePayload, KlikQrisResponse } from './types';

export class KlikQrisClient {
  private apiUrl = 'https://klikqris.com/api/qrisv2/create';
  private apiKey: string;
  private merchantId: string;

  constructor(apiKey?: string, merchantId?: string) {
    this.apiKey = apiKey || process.env.KLIKQRIS_API_KEY || '';
    this.merchantId = merchantId || process.env.KLIKQRIS_MERCHANT_ID || '';

    if (!this.apiKey || !this.merchantId) {
      console.warn('⚠️ KlikQrisClient: API Key or Merchant ID is missing');
    }
  }

  /**
   * Create a new QRIS payment transaction
   */
  async createTransaction(payload: { orderId: string; amount: number; description: string }): Promise<KlikQrisResponse> {
    try {
      const body: KlikQrisCreatePayload = {
        order_id: payload.orderId,
        id_merchant: this.merchantId,
        amount: payload.amount,
        keterangan: payload.description
      };

      const response = await axios.post<KlikQrisResponse>(this.apiUrl, body, {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
          'id_merchant': this.merchantId,
          'User-Agent': 'Mozilla/5.0 (KlikQRIS Adapter; Independent Service)'
        }
      });

      return response.data;
    } catch (error: any) {
      console.error('❌ KlikQRIS Adapter Error:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Verify if the signature from webhook matches the stored signature
   * Note: KlikQRIS currently provides the signature in the creation response 
   * which we store and compare later in the webhook.
   */
  verifySignature(incomingSignature: string, storedSignature: string): boolean {
    if (!incomingSignature || !storedSignature) return false;
    return incomingSignature === storedSignature;
  }
}

// Export a default singleton for convenience if using default env vars
export const klikQris = new KlikQrisClient();
