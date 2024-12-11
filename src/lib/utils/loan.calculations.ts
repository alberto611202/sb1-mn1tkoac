export const calculateMonthlyPayment = (
  principal: number,
  annualInterestRate: number,
  termInMonths: number
): number => {
  const monthlyInterestRate = annualInterestRate / 12 / 100;
  
  // Fix: Handle edge case when interest rate is 0
  if (monthlyInterestRate === 0) {
    return principal / termInMonths;
  }
  
  const numerator = principal * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, termInMonths);
  const denominator = Math.pow(1 + monthlyInterestRate, termInMonths) - 1;
  return numerator / denominator;
};

export const calculateTotalInterest = (
  monthlyPayment: number,
  termInMonths: number,
  principal: number
): number => {
  return Math.max(0, (monthlyPayment * termInMonths) - principal);
};

export const calculateAmortizationSchedule = (
  principal: number,
  annualInterestRate: number,
  termInMonths: number
): Array<{
  paymentNumber: number;
  payment: number;
  principal: number;
  interest: number;
  remainingBalance: number;
}> => {
  const monthlyInterestRate = annualInterestRate / 12 / 100;
  const monthlyPayment = calculateMonthlyPayment(principal, annualInterestRate, termInMonths);
  let remainingBalance = principal;
  const schedule = [];

  for (let i = 1; i <= termInMonths; i++) {
    const interest = remainingBalance * monthlyInterestRate;
    const principalPart = monthlyPayment - interest;
    remainingBalance -= principalPart;

    schedule.push({
      paymentNumber: i,
      payment: monthlyPayment,
      principal: principalPart,
      interest: interest,
      remainingBalance: Math.max(0, remainingBalance), // Fix: Ensure remaining balance is never negative
    });
  }

  return schedule;
};

export const calculateLatePaymentPenalty = (
  amount: number,
  daysLate: number,
  penaltyRate: number = 0.05
): number => {
  // Fix: Ensure penalty calculation is correct and bounded
  const monthsLate = Math.ceil(daysLate / 30);
  const maxPenalty = amount * 0.5; // Maximum penalty is 50% of the payment amount
  const calculatedPenalty = amount * (penaltyRate * monthsLate);
  return Math.min(calculatedPenalty, maxPenalty);
};