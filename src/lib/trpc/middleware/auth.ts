import { t } from '../trpc';
import { TRPCError } from '@trpc/server';
import { verifyToken } from '../../utils/security';

export const isAuthenticated = t.middleware(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ 
      code: 'UNAUTHORIZED',
      message: 'Debes iniciar sesión para acceder a esta función'
    });
  }
  return next({
    ctx: {
      user: ctx.user,
    },
  });
});

export const isAdmin = t.middleware(({ ctx, next }) => {
  if (!ctx.user || ctx.user.role !== 'ADMIN') {
    throw new TRPCError({ 
      code: 'FORBIDDEN',
      message: 'No tienes permisos de administrador'
    });
  }
  return next({
    ctx: {
      user: ctx.user,
    },
  });
});