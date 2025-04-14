import { getAmountStyle } from '@/components/util/amount-style';
import { AccountTransaction } from '@/features/accounts/accounts.types';
import { cn } from '@/utils/cn';
import { useDisplayAmountHelper } from '@/utils/format-amount';

type Props = {
  transaction: AccountTransaction;
};

export default function TransactionItem({ transaction }: Props) {
  const { getDisplayAmount } = useDisplayAmountHelper({});

  return (
    <div className="px-3.5">
      <div className="flex justify-between gap-0.5 border-b border-gray-100 py-3 first:border-t last:border-b-0">
        <p className="line-clamp-1 text-xs text-gray-500">{transaction.description}</p>
        <p className={cn('text-xs', getAmountStyle(transaction.amount))}>
          {getDisplayAmount({ amount: transaction.amount })}
        </p>
      </div>
    </div>
  );
}
