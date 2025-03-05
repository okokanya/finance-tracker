import Title from '@/components/title/title';
import { getAmountStyle } from '@/components/util/amount-style';
import { getDisplayAmount } from '@/utils/format-amount';

interface TotalBalanceProps {
  amount: number;
}

const TotalBalance: React.FC<TotalBalanceProps> = ({ amount }) => (
  <Title className={getAmountStyle(amount)} variant="h1">
    {getDisplayAmount(amount)}
  </Title>
);

export default TotalBalance;
