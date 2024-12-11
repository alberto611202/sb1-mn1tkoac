import { t } from '../trpc';
import { isAuthenticated } from '../middleware/auth';
import { prisma } from '../../db/prisma';
import { createPaymentSchema } from '../../validation/payment.schema';
import { TRPCError } from '@trpc/server';
import { calculateLatePaymentPenalty } from '../../utils/loan.calculations';

export const paymentRouter = t.router({
  create: t.procedure
    .use(isAuthenticated)
    .input(createPaymentSchema)
    .mutation(async ({ input, ctx }) => {
      const loan = await prisma.loan.findUnique({
        where: { id: input.loanId },
        include: {
          client: true,
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
          message: 'No tienes permiso para registrar pagos para este préstamo',
        });
      }

      // Calculate late payment penalty if applicable
      const today = new Date();
      const daysLate = Math.max(0, Math.floor((today.getTime() - input.paymentDate.getTime()) / (1000 * 60 * 60 * 24)));
      const penalty = daysLate > 0 ? calculateLatePaymentPenalty(input.amount, daysLate) : 0;

      const payment = await prisma.payment.create({
        data: {
          ...input,
          amount: input.amount + penalty,
        },
      });

      // Update loan status if needed
      const totalPaid = await prisma.payment.aggregate({
        where: { loanId: loan.id },
        _sum: { amount: true },
      });

      if (totalPaid._sum.amount >= loan.amount) {
        await prisma.loan.update({
          where: { id: loan.id },
          data: { status: 'COMPLETED' },
        });
      }

      return payment;
    }),

  getByLoanId: t.procedure
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
          message: 'No tienes permiso para ver estos pagos',
        });
      }

      return loan.payments;
    }),
});