export function getDisplayAmount(amount: number) {
  const formattedAmount = new Intl.NumberFormat('ru-RU').format(Math.abs(amount));
  return `${amount < 0 ? '— ' : ''}${formattedAmount} ₽`;
}
