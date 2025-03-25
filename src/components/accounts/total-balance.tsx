import Title from '@/components/base/title';
import { getAmountStyle } from '@/components/util/amount-style';
import { useDisplayAmountHelper } from '@/utils/format-amount';

type Props = {
  amount: number;
};

export default function TotalBalance({ amount }: Props) {
  const { getDisplayAmount } = useDisplayAmountHelper({});

  return (
    <Title className={getAmountStyle(amount)} variant="h1">
      {getDisplayAmount({ amount: amount })}
    </Title>
  );
}
