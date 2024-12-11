import { t } from '../trpc';
import { isAuthenticated } from '../middleware/auth';
import { prisma } from '../../db/prisma';
import { createLoanSchema, updateLoanSchema } from '../../validation/loan.schema';
import { TRPCError } from '@trpc/server';
import { calculateAmortizationSchedule } from '../../utils/loan.calculations';

export const loanRouter = t.router({
  create: t.procedure
    .use(isAuthenticated)
    .input(createLoanSchema)
    .mutation(async ({ input, ctx }) => {
      const client = await prisma.client.findUnique({
        where: { id: input.clientId },
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
          message: 'No tienes permiso para crear préstamos para este cliente',
        });
      }

      const endDate = new Date(input.startDate);
      endDate.setMonth(endDate.getMonth() + input.term);

      return prisma.loan.create({
        data: {
          ...input,
          endDate,
          status: 'PENDING',
        },
      });
    }),

  getById: t.procedure
    .use(isAuthenticated)
    .input(z.string())
    .query(async ({ input, ctx }) => {
      const loan = await prisma.loan.findUnique({
        where: { id: input },
        include: {
          client: true,
          payments: true,
        },
      });

      if (!loan) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Préstamo no encontrado',
        });
      }

      if (loan.client.userId !== ctx.user.id) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'No tienes permiso para ver este préstamo',
        });
      }

      const amortizationSchedule = calculateAmortizationSchedule(
        loan.amount,
        loan.interestRate,
        loan.term
      );

      return {
        ...loan,
        amortizationSchedule,
      };
    }),

  list: t.procedure
    .use(isAuthenticated)
    .query(async ({ ctx }) => {
      return prisma.loan.findMany({
        where: {
          client: {
            userId: ctx.user.id,
          },
        },
        include: {
          client: true,
          payments: true,
        },
      });
    }),
});