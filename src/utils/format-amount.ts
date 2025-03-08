export function getDisplayAmount(amount: number, isAddPlusSign: boolean = false) {
  const formattedAmount = new Intl.NumberFormat('ru-RU').format(Math.abs(amount));
  return `${amount < 0 ? '— ' : isAddPlusSign ? '+ ' : ''}${formattedAmount} ₽`;
}
