import { z } from 'zod';

export const createLoanSchema = z.object({
  clientId: z.string().min(1, 'El cliente es requerido'),
  amount: z.number()
    .positive('El monto debe ser positivo')
    .max(1000000, 'El monto máximo permitido es 1,000,000'),
  interestRate: z.number()
    .min(0, 'La tasa de interés no puede ser negativa')
    .max(100, 'La tasa de interés no puede ser mayor a 100%'),
  term: z.number()
    .int('El plazo debe ser un número entero')
    .min(1, 'El plazo mínimo es 1 mes')
    .max(60, 'El plazo máximo es 60 meses'),
  startDate: z.date()
    .min(new Date(), 'La fecha de inicio debe ser futura'),
});

export const updateLoanSchema = createLoanSchema.extend({
  id: z.string(),
  status: z.enum(['PENDING', 'ACTIVE', 'COMPLETED', 'DEFAULTED']),
}).partial();