import { Button as HeadlessButton } from '@headlessui/react';
import { ArrowsRightLeftIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';

import Title from '@/components/base/title';
import texts from '@/features/accounts/accounts.texts';
import { AccountResponse } from '@/features/accounts/accounts.types';
import { cn } from '@/utils/cn';
import { useDisplayAmountHelper } from '@/utils/format-amount';

type Props = {
  account: AccountResponse;
  isTransactionAvailable: boolean;
  onAddTransactionClick: () => void;
  onManageClick: () => void;
};

export default function AccountCard({
  account,
  isTransactionAvailable,
  onManageClick,
  onAddTransactionClick,
}: Props) {
  const getVariantStyles = () => {
    switch (account.type) {
      case 'savings':
        return 'bg-green-50';
      case 'debt_i_owe':
        return 'bg-red-50';
      case 'debt_they_owe':
        return 'bg-blue-50';
      default:
        return 'bg-white';
    }
  };

  const getAmountStyle = () => {
    switch (account.type) {
      case 'savings':
        return 'text-emerald-500';
      case 'debt_i_owe':
        return 'text-red-500';
      case 'debt_they_owe':
        return 'text-blue-700';
      default:
        return 'text-gray-800';
    }
  };

  const { getDisplayAmount } = useDisplayAmountHelper({});
  const displayAmount = getDisplayAmount({
    amount: account.displayBalance,
    maxNumberPartLength: 16,
  });
  const amountStyle = getAmountStyle();

  return (
    <div
      className={cn(
        `flex h-[68px] w-[335px] min-w-[335px] flex-col items-start justify-between gap-1 rounded-lg px-4 py-2 md:h-[118px] md:w-[289px] md:min-w-[289px] md:gap-2 md:px-6 md:py-4`,
        `${getVariantStyles()} uikit-card-shadow`
      )}
    >
      <div className="flex w-full justify-between gap-1">
        <p className="line-clamp-1 text-left text-sm text-gray-800 md:text-base md:font-bold">
          {account.name}
        </p>
        <div className="flex items-center gap-1">
          {isTransactionAvailable && (
            <HeadlessButton title={texts.accountCard.transaction} onClick={onAddTransactionClick}>
              <ArrowsRightLeftIcon className="size-5 text-gray-500" />
            </HeadlessButton>
          )}
          <HeadlessButton title={texts.accountCard.manage} onClick={onManageClick}>
            <Cog6ToothIcon className="size-5 text-gray-500" />
          </HeadlessButton>
        </div>
      </div>
      <div className="flex w-full items-baseline justify-between gap-0.5 md:flex-col">
        <p className="line-clamp-1 flex-1 text-sm text-gray-500">{account.description}</p>
        <Title variant="h3" className={cn(amountStyle, 'uikit-show-mobile line-clamp-1')}>
          {displayAmount}
        </Title>
        <Title className={cn(amountStyle, 'uikit-show-desktop line-clamp-1')}>
          {displayAmount}
        </Title>
      </div>
    </div>
  );
}
