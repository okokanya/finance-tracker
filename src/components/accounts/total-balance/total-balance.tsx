import Title from '@/components/title/title';
import { getDisplayAmount } from '@/utils/format-amount';

interface TotalBalanceProps {
  amount: number;
}

const TotalBalance: React.FC<TotalBalanceProps> = ({ amount }) => {
  const getAmountStyles = () => {
    if (amount > 0) {
      return 'text-emerald-500';
    } else if (amount < 0) {
      return 'text-red-500';
    } else {
      return 'text-gray-800';
    }
  };

  const displayAmount = getDisplayAmount(amount);

  return (
    <Title className={getAmountStyles()} variant="h1">
      {displayAmount}
    </Title>
  );
};

export default TotalBalance;
