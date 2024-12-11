import { z } from 'zod';

export const phoneRegex = /^\+?[1-9]\d{1,14}$/;

export const clientValidation = z.object({
  firstName: z.string().min(1, 'El nombre es requerido'),
  lastName: z.string().min(1, 'El apellido es requerido'),
  idNumber: z.string().min(1, 'El número de identificación es requerido'),
  email: z.string().email('Correo electrónico inválido').optional(),
  phone: z.string().regex(phoneRegex, 'Número de teléfono inválido'),
  address: z.string().min(1, 'La dirección es requerida'),
});

export const loanValidation = z.object({
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

export const paymentValidation = z.object({
  amount: z.number().positive('El monto debe ser positivo'),
  paymentDate: z.date(),
  paymentType: z.enum(['CASH', 'TRANSFER', 'CHECK']),
});