import Title from '@/components/base/title';
import { getAmountStyle } from '@/components/util/amount-style';
import { cn } from '@/utils/cn';
import { useDisplayAmountHelper } from '@/utils/format-amount';

type Props = {
  amount: number;
};

export default function TotalBalance({ amount }: Props) {
  const { getDisplayAmount } = useDisplayAmountHelper({});
  const amountStyle = getAmountStyle(amount);
  const displayAmount = getDisplayAmount({ amount: amount });

  return (
    <>
      <Title className={cn(amountStyle, 'inline md:hidden')}>{displayAmount}</Title>
      <Title className={cn(amountStyle, 'hidden md:inline')} variant="h1">
        {displayAmount}
      </Title>
    </>
  );
}
