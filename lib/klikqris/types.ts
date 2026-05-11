export interface KlikQrisCreatePayload {
  order_id: string;
  id_merchant: string;
  amount: number;
  keterangan: string;
}

export interface KlikQrisResponse {
  status: boolean;
  message: string;
  data: {
    order_id: string;
    amount: number;
    total_amount: number;
    qris_url: string;
    expired_at: string;
    direct_url: string;
    signature: string;
  };
}

export interface KlikQrisWebhookData {
  order_id: string;
  amount: number;
  total_amount: number;
  status: 'PENDING' | 'PAID' | 'EXPIRED' | 'CANCEL' | 'SUCCESS';
  signature: string;
  created_at: string;
}

export interface KlikQrisWebhookPayload {
  data: KlikQrisWebhookData;
}
