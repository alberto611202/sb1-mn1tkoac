export const calculateMonthlyPayment = (
  principal: number,
  annualInterestRate: number,
  termInMonths: number
): number => {
  const monthlyInterestRate = annualInterestRate / 12 / 100;
  const numerator = principal * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, termInMonths);
  const denominator = Math.pow(1 + monthlyInterestRate, termInMonths) - 1;
  return numerator / denominator;
};

export const calculateTotalInterest = (
  monthlyPayment: number,
  termInMonths: number,
  principal: number
): number => {
  return (monthlyPayment * termInMonths) - principal;
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
      remainingBalance: Math.max(0, remainingBalance),
    });
  }

  return schedule;
};

export const calculateLatePaymentPenalty = (
  amount: number,
  daysLate: number,
  penaltyRate: number = 0.05
): number => {
  return amount * (penaltyRate * Math.ceil(daysLate / 30));
};