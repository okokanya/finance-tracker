import Text from '@/components/text/text';
import { getAmountStyle } from '@/components/util/amount-style';
import { AccountTransaction } from '@/features/accounts/accounts.types';
import { getDisplayAmount } from '@/utils/format-amount';

interface TransactionItemProps {
  transaction: AccountTransaction;
}

const TransactionItem: React.FC<TransactionItemProps> = ({ transaction }) => (
  <div className="px-3.5">
    <div className="flex justify-between border-b border-gray-100 py-3 first:border-t last:border-b-0">
      <Text variant={'xs'} className="text-gray-500">
        {transaction.description}
      </Text>
      <Text variant={'xs'} className={getAmountStyle(transaction.amount)}>
        {getDisplayAmount(transaction.amount)}
      </Text>
    </div>
  </div>
);

export default TransactionItem;
