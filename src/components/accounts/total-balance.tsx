import Title from '@/components/title/title';
import { getAmountStyle } from '@/components/util/amount-style';
import { getDisplayAmount } from '@/utils/format-amount';

type Props = {
  amount: number;
};

export default function TotalBalance({ amount }: Props) {
  return (
    <Title className={getAmountStyle(amount)} variant="h1">
      {getDisplayAmount(amount)}
    </Title>
  );
}
