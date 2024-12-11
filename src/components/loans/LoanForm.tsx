import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { trpc } from '../../lib/trpc/client';

const loanSchema = z.object({
  clientId: z.string().min(1, 'El cliente es requerido'),
  amount: z.number().positive('El monto debe ser positivo'),
  interestRate: z.number().positive('La tasa de interés debe ser positiva'),
  term: z.number().positive('El plazo debe ser positivo'),
  startDate: z.date(),
});

type LoanFormData = z.infer<typeof loanSchema>;

export const LoanForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<LoanFormData>({
    resolver: zodResolver(loanSchema),
  });

  const createLoan = trpc.protected.createLoan.useMutation();

  const onSubmit = (data: LoanFormData) => {
    createLoan.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
          Monto del Préstamo
        </label>
        <input
          {...register('amount', { valueAsNumber: true })}
          type="number"
          step="0.01"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
        {errors.amount && (
          <p className="mt-1 text-sm text-red-600">{errors.amount.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="interestRate" className="block text-sm font-medium text-gray-700">
          Tasa de Interés (%)
        </label>
        <input
          {...register('interestRate', { valueAsNumber: true })}
          type="number"
          step="0.01"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
        {errors.interestRate && (
          <p className="mt-1 text-sm text-red-600">{errors.interestRate.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="term" className="block text-sm font-medium text-gray-700">
          Plazo (meses)
        </label>
        <input
          {...register('term', { valueAsNumber: true })}
          type="number"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
        {errors.term && (
          <p className="mt-1 text-sm text-red-600">{errors.term.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
          Fecha de Inicio
        </label>
        <input
          {...register('startDate', { valueAsDate: true })}
          type="date"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
        {errors.startDate && (
          <p className="mt-1 text-sm text-red-600">{errors.startDate.message}</p>
        )}
      </div>

      <div>
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Crear Préstamo
        </button>
      </div>
    </form>
  );
};