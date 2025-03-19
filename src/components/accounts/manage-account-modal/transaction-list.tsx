import TransactionItem from '@/components/accounts/manage-account-modal/transaction-item';
import Accordion from '@/components/base/accordion';
import Button from '@/components/base/button';
import Spinner from '@/components/base/spinner';
import TopBottomBorder from '@/components/base/top-bottom-border';
import texts from '@/features/accounts/accounts.texts';
import { AccountTransaction } from '@/features/accounts/accounts.types';

type Props = {
  transactions?: AccountTransaction[];
  isLoading: boolean;
  isError: boolean;
  repeatOnError: () => void;
};

export default function TransactionList({
  transactions,
  isLoading,
  isError,
  repeatOnError,
}: Props) {
  const textClasses =
    'my-1 block h-10 w-full px-3.5 py-2.5 font-inter text-sm font-normal text-blue-500';

  if (isLoading)
    return (
      <TopBottomBorder className="flex items-center justify-between">
        <span className={textClasses}>{texts.manageAccount.action.accountOperations}</span>
        <Spinner />
      </TopBottomBorder>
    );

  if (isError)
    return (
      <TopBottomBorder className="flex justify-between">
        <span className={textClasses}>{texts.manageAccount.action.transactionsError}</span>
        <Button className="my-1" variant="secondary" onClick={repeatOnError}>
          {texts.repeat}
        </Button>
      </TopBottomBorder>
    );

  if (transactions?.length === 0)
    return (
      <TopBottomBorder>
        <span className={textClasses}>{texts.manageAccount.action.noTransactions}</span>
      </TopBottomBorder>
    );

  return (
    <TopBottomBorder>
      <Accordion title={texts.manageAccount.action.accountOperations} className="my-1">
        {transactions?.map(transaction => (
          <TransactionItem key={transaction.id} transaction={transaction} />
        ))}
      </Accordion>
    </TopBottomBorder>
  );
}
