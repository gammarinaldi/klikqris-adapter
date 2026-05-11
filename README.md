# 🚀 KlikQRIS Adapter

A premium, modular, and framework-agnostic adapter for integrating **KlikQRIS** payment gateway into any JavaScript/TypeScript application.

This adapter decouples the core payment logic from specific frameworks, allowing you to use it in Next.js, Express, NestJS, or even vanilla Node.js environments.

---

## ✨ Features

- **Framework Agnostic**: Pure TypeScript client that works anywhere.
- **Easy Integration**: Simple API for creating transactions and verifying signatures.
- **Next.js Ready**: Includes pre-built API routes and UI components for rapid deployment.
- **Type Safe**: Full TypeScript support with detailed interfaces for requests and responses.
- **Beautiful UI**: Includes a premium `QRISPoster` component for a professional payment experience.

---

## 🛠️ Installation

1. **Clone or copy** the files into your project.
2. **Install dependencies**:
   ```bash
   npm install axios
   ```

---

## ⚙️ Configuration

Add the following environment variables to your `.env` file:

```env
KLIKQRIS_API_KEY=your_api_key_here
KLIKQRIS_MERCHANT_ID=your_merchant_id_here
```

---

## 🚀 Quick Start (Core Adapter)

```typescript
import { klikQris } from './lib/klikqris/adapter';

// Create a transaction
const result = await klikQris.createTransaction({
  orderId: 'ORDER-123',
  amount: 50000,
  description: 'Premium Subscription'
});

if (result.status) {
  console.log('QRIS URL:', result.data.qris_url);
}
```

---

## 📂 Project Structure

- `lib/klikqris/`: The core framework-agnostic client.
  - `adapter.ts`: The main `KlikQrisClient` class.
  - `types.ts`: TypeScript interfaces for the API.
- `api/klikqris/`: **Example** Next.js App Router implementation.
  - `route.ts`: Creation endpoint.
  - `status/`: Payment status polling.
  - `webhook/`: Automated payment verification and activation.
- `component/ui/klikqris/`: **Example** UI components.
  - `QRISPoster.tsx`: A professional QRIS display component.

---

## 🖥️ Next.js Implementation

If you are using Next.js, you can simply move the `api` and `component` folders into your `src` or root directory.

### UI Usage:

```tsx
import QRISPoster from '@/component/ui/klikqris/QRISPoster';

// In your payment page
<QRISPoster 
  qrisUrl={paymentData.qrisUrl} 
  merchantName="YOUR BUSINESS"
/>
```

---

## 🛡️ License

MIT
