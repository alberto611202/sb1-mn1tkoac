import { z } from 'zod';
import { phoneRegex } from '../utils/validation';

export const createClientSchema = z.object({
  firstName: z.string().min(1, 'El nombre es requerido'),
  lastName: z.string().min(1, 'El apellido es requerido'),
  idNumber: z.string().min(1, 'El número de identificación es requerido'),
  email: z.string().email('Correo electrónico inválido').optional(),
  phone: z.string().regex(phoneRegex, 'Número de teléfono inválido'),
  address: z.string().min(1, 'La dirección es requerida'),
  photoUrl: z.string().url().optional(),
  documentUrls: z.array(z.string().url()),
});

export const updateClientSchema = createClientSchema.extend({
  id: z.string(),
}).partial();