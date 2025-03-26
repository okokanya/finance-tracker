import { Button as HeadlessButton } from '@headlessui/react';
import { ArrowsRightLeftIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';

import Text from '@/components/base/text';
import Title from '@/components/base/title';
import { CARD_SHADOW_CLASS } from '@/components/util/common-classes';
import texts from '@/features/accounts/accounts.texts';
import { AccountResponse } from '@/features/accounts/accounts.types';
import { cn } from '@/utils/cn';
import { useDisplayAmountHelper } from '@/utils/format-amount';

type Props = {
  account: AccountResponse;
  onAddTransactionClick: () => void;
  onManageClick: () => void;
};

export default function AccountCard({ account, onManageClick, onAddTransactionClick }: Props) {
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
        `${getVariantStyles()} ${CARD_SHADOW_CLASS}`
      )}
    >
      <div className="flex w-full justify-between gap-1">
        <Text variant="sm" className="line-clamp-1 inline text-left text-gray-800 md:hidden">
          {account.name}
        </Text>
        <Text isBold={true} className="line-clamp-1 hidden text-left text-gray-800 md:inline">
          {account.name}
        </Text>
        <div className="flex items-center gap-1">
          <HeadlessButton title={texts.accountCard.transaction} onClick={onAddTransactionClick}>
            <ArrowsRightLeftIcon className="size-5 text-gray-500" />
          </HeadlessButton>
          <HeadlessButton title={texts.accountCard.manage} onClick={onManageClick}>
            <Cog6ToothIcon className="size-5 text-gray-500" />
          </HeadlessButton>
        </div>
      </div>
      <div className="flex w-full items-baseline justify-between gap-0.5 md:flex-col">
        <Text variant="sm" className="m-0 line-clamp-1 flex-1 text-gray-500">
          {account.description}
        </Text>
        <Title variant="h3" className={cn(amountStyle, 'line-clamp-1 inline md:hidden')}>
          {displayAmount}
        </Title>
        <Title className={cn(amountStyle, 'line-clamp-1 hidden md:inline')}>{displayAmount}</Title>
      </div>
    </div>
  );
}
