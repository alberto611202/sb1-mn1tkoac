import { t } from '../trpc';
import { isAuthenticated } from '../middleware/auth';
import { prisma } from '../../db/prisma';
import { createClientSchema, updateClientSchema } from '../../validation/client.schema';
import { TRPCError } from '@trpc/server';

export const clientRouter = t.router({
  create: t.procedure
    .use(isAuthenticated)
    .input(createClientSchema)
    .mutation(async ({ input, ctx }) => {
      const existingClient = await prisma.client.findUnique({
        where: { idNumber: input.idNumber },
      });

      if (existingClient) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'Ya existe un cliente con este número de identificación',
        });
      }

      return prisma.client.create({
        data: {
          ...input,
          userId: ctx.user.id,
        },
      });
    }),

  update: t.procedure
    .use(isAuthenticated)
    .input(updateClientSchema)
    .mutation(async ({ input, ctx }) => {
      const client = await prisma.client.findUnique({
        where: { id: input.id },
      });

      if (!client) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Cliente no encontrado',
        });
      }

      if (client.userId !== ctx.user.id) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'No tienes permiso para actualizar este cliente',
        });
      }

      return prisma.client.update({
        where: { id: input.id },
        data: input,
      });
    }),

  getById: t.procedure
    .use(isAuthenticated)
    .input(z.string())
    .query(async ({ input, ctx }) => {
      const client = await prisma.client.findUnique({
        where: { id: input },
        include: {
          loans: {
            include: {
              payments: true,
            },
          },
        },
      });

      if (!client) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Cliente no encontrado',
        });
      }

      return client;
    }),

  list: t.procedure
    .use(isAuthenticated)
    .query(async ({ ctx }) => {
      return prisma.client.findMany({
        where: {
          userId: ctx.user.id,
        },
        include: {
          loans: true,
        },
      });
    }),
});