import Text from '@/components/base/text';
import { getAmountStyle } from '@/components/util/amount-style';
import { AccountTransaction } from '@/features/accounts/accounts.types';
import { useDisplayAmountHelper } from '@/utils/format-amount';

type Props = {
  transaction: AccountTransaction;
};

export default function TransactionItem({ transaction }: Props) {
  const { getDisplayAmount } = useDisplayAmountHelper({});

  return (
    <div className="px-3.5">
      <div className="flex justify-between border-b border-gray-100 py-3 first:border-t last:border-b-0">
        <Text variant={'xs'} className="text-gray-500">
          {transaction.description}
        </Text>
        <Text variant={'xs'} className={getAmountStyle(transaction.amount)}>
          {getDisplayAmount({ amount: transaction.amount })}
        </Text>
      </div>
    </div>
  );
}
