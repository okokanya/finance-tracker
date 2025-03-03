export const getAmountStyle = (amount: number) => {
  if (amount === 0) {
    return 'text-gray-800';
  }

  return amount > 0 ? 'text-emerald-500' : 'text-red-500'
};
