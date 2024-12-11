import { t } from './trpc';
import { authRouter } from './routers/auth.router';
import { clientRouter } from './routers/client.router';
import { loanRouter } from './routers/loan.router';
import { paymentRouter } from './routers/payment.router';

export const appRouter = t.router({
  auth: authRouter,
  client: clientRouter,
  loan: loanRouter,
  payment: paymentRouter,
});

export type AppRouter = typeof appRouter;