import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import Button from '@/components/base/button';
import Input from '@/components/base/input';
import Modal, { ModalProps } from '@/components/base/modal';
import { OptionType } from '@/components/base/select/option-type';
import Select from '@/components/base/select/select';
import Title from '@/components/base/title';
import { getAmountStyle } from '@/components/util/amount-style';
import { ACCOUNT_TRANSACTION_OPTIONS } from '@/features/accounts/accounts.constants';
import texts from '@/features/accounts/accounts.texts';
import {
  AccountResponse,
  AccountTransactionForm,
  accountTransactionFormSchema,
  AccountTransactionType,
  AddAccountTransactionFormSuccessResult,
} from '@/features/accounts/accounts.types';
import { cn } from '@/utils/cn';
import { getDisplayAmount } from '@/utils/format-amount';

type Props = Omit<ModalProps, 'title' | 'children'> & {
  account: AccountResponse;
  accounts: OptionType<string>[];
  isShowTransactionAmountTitle: (amount: number) => boolean;
  isTransferOperation: (value: AccountTransactionType) => boolean;
  submitButtonText: (value: AccountTransactionType) => string;
  isTransactionValid: (
    type: AccountTransactionType,
    amount: number,
    targetAccountId: string
  ) => boolean;
  onSuccess: (data: AddAccountTransactionFormSuccessResult) => void;
};

export default function AddAccountTransactionModal({
  account,
  accounts,
  isShowTransactionAmountTitle,
  isTransferOperation,
  submitButtonText,
  isTransactionValid,
  isOpen,
  onClose,
  onSuccess,
}: Props) {
  const [selectedType, setSelectedType] = useState<OptionType<AccountTransactionType>>(
    ACCOUNT_TRANSACTION_OPTIONS[0]
  );
  const [selectedAccount, setSelectedAccount] = useState<OptionType<string>>(accounts[0]);
  const isTransfer = isTransferOperation(selectedType.value);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<AccountTransactionForm>({
    resolver: zodResolver(accountTransactionFormSchema),
  });

  const amount = watch('amount');
  const amountToDisplay = isNaN(amount) ? 0 : isTransfer ? -amount : amount;

  const isTransactionValidated = isTransactionValid(
    selectedType.value,
    amount,
    selectedAccount.value
  );

  const onSubmit = (data: AccountTransactionForm) => {
    onSuccess({
      type: selectedType.value,
      amount: data.amount,
      targetAccountId: selectedAccount.value,
    });
    reset();
  };

  return (
    <Modal
      title={`${texts.accountTransaction.action.title} ${account.name}`}
      isOpen={isOpen}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex w-full flex-col gap-6">
        <div className="mt-1 flex w-full flex-col gap-3">
          <div className="flex w-full flex-wrap justify-stretch gap-2">
            <Title className="line-clamp-1">{getDisplayAmount(account.displayBalance)}</Title>
            {isShowTransactionAmountTitle(amount) && (
              <Title className={cn('line-clamp-1', getAmountStyle(amountToDisplay))}>
                {getDisplayAmount(amountToDisplay, true)}
              </Title>
            )}
          </div>
          <div className="flex w-full flex-wrap justify-stretch gap-2">
            <Select
              label={texts.accountTransaction.action.operationType}
              selected={selectedType}
              options={ACCOUNT_TRANSACTION_OPTIONS}
              onChangeOption={selected =>
                setSelectedType(selected as OptionType<AccountTransactionType>)
              }
              wrapperClassName="w-full min-w-[262px] flex-1"
            />
            <Input
              label={texts.accountTransaction.action.amount}
              placeholder={texts.accountTransaction.action.amountPlaceholder}
              wrapperClassName="w-full min-w-[262px] flex-1"
              className="w-full"
              errorText={errors?.amount?.message}
              type="text"
              {...register('amount', { valueAsNumber: true })}
            />
          </div>
          {isTransfer && (
            <Select
              label={texts.accountTransaction.action.transferAccount}
              selected={selectedAccount}
              options={accounts}
              onChangeOption={selected => setSelectedAccount(selected as OptionType<string>)}
            />
          )}
        </div>
        <div className="flex w-full gap-2">
          <Button type="submit" className="w-4/5" disabled={!isTransactionValidated}>
            {submitButtonText(selectedType.value)}
          </Button>
          <Button variant="secondary" onClick={onClose}>
            {texts.cancel}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
