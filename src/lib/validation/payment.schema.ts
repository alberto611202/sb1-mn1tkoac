import { z } from 'zod';

export const createPaymentSchema = z.object({
  loanId: z.string().min(1, 'El préstamo es requerido'),
  amount: z.number().positive('El monto debe ser positivo'),
  paymentDate: z.date(),
  paymentType: z.enum(['CASH', 'TRANSFER', 'CHECK']),
});