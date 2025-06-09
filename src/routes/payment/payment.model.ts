import { z } from 'zod'

export const PaymentTransactionSchema = z.object({
  id: z.number(),
  gateway: z.string(),
  transactionDate: z.date(),
  accountNumber: z.string().nullable(),
  subAccount: z.string().nullable(),
  amountIn: z.number(),
  amountOut: z.number(),
  accumulated: z.number(),
  code: z.string().nullable(),
  transactionContent: z.string().nullable(),
  referenceNumber: z.string().nullable(),
  body: z.string().nullable(),
  createdAt: z.date()
})

/**
 * https://docs.sepay.vn/tich-hop-webhooks.html
 */
export const WebhookPaymentBodySchema = z.object({
  id: z.number(), // Transaction ID on SePay
  gateway: z.string(), // Bank brand name
  transactionDate: z.string(), // Transaction time from the bank side
  accountNumber: z.string().nullable(), // Bank account number
  code: z.string().nullable(), // Payment code (SePay auto-detects based on configuration at Company -> General settings)
  content: z.string().nullable(), // Transfer content
  transferType: z.enum(['in', 'out']), // Transaction type. 'in' means money in, 'out' means money out
  transferAmount: z.number(), // Transaction amount
  accumulated: z.number(), // Account balance (accumulated)
  subAccount: z.string().nullable(), // Sub bank account (identification account)
  referenceCode: z.string().nullable(), // Reference code from SMS message
  description: z.string() // Full content of the SMS message
})

export type PaymentTransactionType = z.infer<typeof PaymentTransactionSchema>
export type WebhookPaymentBodyType = z.infer<typeof WebhookPaymentBodySchema>
