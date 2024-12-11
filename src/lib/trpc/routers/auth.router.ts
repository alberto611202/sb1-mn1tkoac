import { t } from '../trpc';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { hashPassword, verifyPassword, generateToken } from '../../utils/security';
import { prisma } from '../../db/prisma';
import { loginSchema, registerSchema } from '../../validation/auth.schema';

export const authRouter = t.router({
  register: t.procedure
    .input(registerSchema)
    .mutation(async ({ input }) => {
      const exists = await prisma.user.findUnique({
        where: { email: input.email },
      });

      if (exists) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'Usuario ya existe',
        });
      }

      const passwordHash = await hashPassword(input.password);

      const user = await prisma.user.create({
        data: {
          email: input.email,
          passwordHash,
          name: input.name,
        },
      });

      return { id: user.id };
    }),

  login: t.procedure
    .input(loginSchema)
    .mutation(async ({ input }) => {
      const user = await prisma.user.findUnique({
        where: { email: input.email },
      });

      if (!user) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Usuario no encontrado',
        });
      }

      const valid = await verifyPassword(input.password, user.passwordHash);

      if (!valid) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Contraseña inválida',
        });
      }

      const token = generateToken({ id: user.id, role: user.role });

      return { token };
    }),
});