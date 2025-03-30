import { useEffect, useMemo, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import AmountInput from '@/components/base/amount-input';
import Button from '@/components/base/button';
import Modal, { ModalProps } from '@/components/base/modal';
import { OptionType } from '@/components/base/select/option-type';
import Select from '@/components/base/select/select';
import Title from '@/components/base/title';
import { getAmountStyle } from '@/components/util/amount-style';
import { MODAL_CONTENT_CLASS } from '@/components/util/common-classes';
import { ACCOUNT_TRANSACTION_OPTIONS } from '@/features/accounts/accounts.constants';
import texts from '@/features/accounts/accounts.texts';
import {
  AccountResponse,
  AccountTransactionType,
  AddAccountTransactionForm,
  addAccountTransactionFormSchema,
  AddAccountTransactionFormSuccessResult,
  TransactionValidationResult,
} from '@/features/accounts/accounts.types';
import { cn } from '@/utils/cn';
import { useDisplayAmountHelper } from '@/utils/format-amount';

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
  ) => TransactionValidationResult;
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
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
    setError,
    clearErrors,
  } = useForm<AddAccountTransactionForm>({
    resolver: zodResolver(addAccountTransactionFormSchema),
    defaultValues: {
      amount: NaN,
    },
  });

  const amount = watch('amount');
  const amountToDisplay = isNaN(amount) ? 0 : isTransfer ? -amount : amount;
  const { getDisplayAmount } = useDisplayAmountHelper({});

  const { isValid, error } = useMemo(
    () => isTransactionValid(selectedType.value, amount, selectedAccount.value),
    [selectedType.value, amount, selectedAccount.value, isTransactionValid]
  );

  useEffect(() => {
    if (!isValid && error) {
      setError('amount', { message: error });
    } else {
      clearErrors('amount');
    }
  }, [isValid, error, setError, clearErrors]);

  const onSubmit = (data: AddAccountTransactionForm) => {
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
      <form onSubmit={handleSubmit(onSubmit)} className={MODAL_CONTENT_CLASS}>
        <div className="mt-1 flex w-full flex-col gap-2 md:gap-4">
          <div className="flex w-full flex-wrap justify-stretch gap-2">
            <Title className="line-clamp-1">
              {getDisplayAmount({ amount: account.displayBalance })}
            </Title>
            {isShowTransactionAmountTitle(amount) && (
              <Title className={cn('line-clamp-1', getAmountStyle(amountToDisplay))}>
                {getDisplayAmount({ amount: amountToDisplay, isAddPlusSign: true })}
              </Title>
            )}
          </div>
          <div className="flex w-full flex-col flex-wrap justify-stretch gap-2 md:flex-row">
            <Select
              label={texts.accountTransaction.action.operationType}
              selected={selectedType}
              options={ACCOUNT_TRANSACTION_OPTIONS}
              onChangeOption={selected =>
                setSelectedType(selected as OptionType<AccountTransactionType>)
              }
              wrapperClassName="w-full md:min-w-[262px] flex-1"
            />
            <AmountInput
              label={texts.accountTransaction.action.amount}
              placeholder={texts.accountTransaction.action.amountPlaceholder}
              wrapperClassName="w-full md:min-w-[262px] flex-1"
              className="w-full"
              errorText={errors?.amount?.message}
              type="text"
              onAmountChanged={value => setValue('amount', value)}
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
        <div className="flex w-full flex-col gap-2 md:flex-row">
          <Button type="submit" className="md:w-4/5" disabled={!isValid}>
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
