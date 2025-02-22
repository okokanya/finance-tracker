import { ComponentProps } from 'react';
import { Button as HeadlessButton } from '@headlessui/react';

import Text from '@/components/text/text';
import Title from '@/components/title/title';
import { CARD_SHADOW_CLASS } from '@/components/util/common-classes';
import { Account } from '@/models';
import { cn } from '@/utils/cn';
import { getDisplayAmount } from '@/utils/format-amount';

type AccountCardProps = ComponentProps<'button'> & {
  account: Omit<Account, 'id' | 'userId' | 'createdAt' | 'updatedAt'>;
};

const AccountCard: React.FC<AccountCardProps> = ({ account, ...otherProps }) => {
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

  const displayAmount = getDisplayAmount(account.balance);

  return (
    <HeadlessButton
      className={cn(
        `flex h-[118px] w-[289px] flex-col items-start justify-between gap-2 rounded-lg px-6 py-4`,
        `${getVariantStyles()} ${CARD_SHADOW_CLASS}`
      )}
      {...otherProps}
    >
      <Text isBold={true} className="line-clamp-1 text-left text-gray-800">
        {account.name}
      </Text>
      <div className="flex w-full flex-col items-start gap-0.5 self-stretch">
        <Text variant="sm" className="line-clamp-1 text-left text-gray-500">
          {account.description}
        </Text>
        <Title className={cn(getAmountStyles(), 'line-clamp-1 text-left')}>{displayAmount}</Title>
      </div>
    </HeadlessButton>
  );
};

export default AccountCard;
