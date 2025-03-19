import { Button as HeadlessButton } from '@headlessui/react';
import { ArrowsRightLeftIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';

import Text from '@/components/base/text';
import Title from '@/components/base/title';
import { CARD_SHADOW_CLASS } from '@/components/util/common-classes';
import texts from '@/features/accounts/accounts.texts';
import { AccountResponse } from '@/features/accounts/accounts.types';
import { cn } from '@/utils/cn';
import { getDisplayAmount } from '@/utils/format-amount';

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

  const getAmountStyles = () => {
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

  const displayAmount = getDisplayAmount(account.displayBalance);

  return (
    <div
      className={cn(
        `flex h-[118px] w-[289px] flex-col items-start justify-between gap-2 rounded-lg px-6 py-4`,
        `${getVariantStyles()} ${CARD_SHADOW_CLASS}`
      )}
    >
      <div className="flex w-full justify-between gap-1">
        <Text isBold={true} className="line-clamp-1 text-left text-gray-800">
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
      <div className="flex w-full flex-col items-start gap-0.5 self-stretch">
        <Text variant="sm" className="line-clamp-1 text-left text-gray-500">
          {account.description}
        </Text>
        <Title className={cn(getAmountStyles(), 'line-clamp-1 text-left')}>{displayAmount}</Title>
      </div>
    </div>
  );
}
