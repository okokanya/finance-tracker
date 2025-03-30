import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import TransactionList from '@/components/accounts/manage-account-modal/transaction-list';
import AmountInput from '@/components/base/amount-input';
import Button from '@/components/base/button';
import Input from '@/components/base/input';
import Modal, { ModalProps } from '@/components/base/modal';
import { OptionType } from '@/components/base/select/option-type';
import Select from '@/components/base/select/select';
import { MODAL_CONTENT_CLASS } from '@/components/util/common-classes';
import { ACCOUNT_OPTIONS } from '@/features/accounts/accounts.constants';
import texts from '@/features/accounts/accounts.texts';
import {
  AccountForm,
  accountFormSchema,
  AccountFormSuccessResult,
  AccountResponse,
} from '@/features/accounts/accounts.types';
import { useManageAccountController } from '@/features/accounts/controllers/manage-account.controller';
import { AccountType } from '@/types/enums';

type Props = Omit<ModalProps, 'title' | 'children'> & {
  account: AccountResponse;
  hasAccountDataChanged: (
    currentAccount: AccountResponse,
    formData: AccountFormSuccessResult
  ) => boolean;
  onUpdate: (account: AccountFormSuccessResult) => void;
  onDelete: () => void;
  onArchive: () => void;
};

export default function ManageAccountModal({
  account,
  isOpen,
  hasAccountDataChanged,
  onClose,
  onUpdate,
  onDelete,
  onArchive,
}: Props) {
  const [selectedType, setSelectedType] = useState<OptionType<AccountType>>(
    ACCOUNT_OPTIONS.find(option => option.value == account.type) ?? ACCOUNT_OPTIONS[0]
  );
  const { transactions, isLoadingTransactions, isTransactionsError, refetchTransactions } =
    useManageAccountController();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<AccountForm>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: {
      name: account.name,
      description: account.description ?? '',
      balance: account.balance,
    },
  });

  const formValues = watch();
  const isDataChanged = hasAccountDataChanged(account, {
    name: formValues.name,
    description: formValues.description,
    type: selectedType.value,
    balance: formValues.balance,
    isArchived: account.isArchived,
  });

  const onSubmit = (data: AccountForm) => {
    onUpdate({
      name: data.name,
      description: data.description,
      type: selectedType.value,
      balance: data.balance,
      isArchived: account.isArchived,
    });
    reset();
  };

  return (
    <Modal
      title={`${texts.manageAccount.action.title} ${account.name}`}
      isOpen={isOpen}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit(onSubmit)} className={MODAL_CONTENT_CLASS}>
        <div className="mt-1 flex w-full flex-col gap-2 md:mt-3 md:gap-4">
          <div className="flex w-full flex-col flex-wrap justify-stretch gap-2 md:flex-row md:gap-4">
            <Input
              label={texts.accountParams.nameTitle}
              placeholder={texts.accountParams.namePlaceholder}
              wrapperClassName="w-full md:min-w-[262px] flex-1"
              className="w-full"
              errorText={errors?.name?.message}
              type="text"
              {...register('name')}
            />
            <Select
              label={texts.accountParams.typeTitle}
              selected={selectedType}
              options={ACCOUNT_OPTIONS}
              onChangeOption={selected => setSelectedType(selected as OptionType<AccountType>)}
              wrapperClassName="w-full md:min-w-[262px] flex-1"
            />
          </div>
          <Input
            label={texts.accountParams.descriptionTitle}
            placeholder={texts.accountParams.descriptionPlaceholder}
            wrapperClassName="w-full"
            className="w-full"
            errorText={errors?.description?.message}
            type="text"
            {...register('description')}
          />
          <AmountInput
            label={texts.accountParams.balanceTitle}
            placeholder={texts.accountParams.balancePlaceholder}
            wrapperClassName="w-full"
            className="w-full"
            errorText={errors?.balance?.message}
            type="text"
            initAmount={formValues.balance}
            onAmountChanged={value => setValue('balance', value)}
          />
          <TransactionList
            transactions={transactions}
            isLoading={isLoadingTransactions}
            isError={isTransactionsError}
            repeatOnError={refetchTransactions}
          />
        </div>
        <div className="flex w-full flex-col gap-2">
          <Button type="submit" className="w-full" disabled={!isDataChanged}>
            {texts.manageAccount.action.updateAccount}
          </Button>
          <div className="flex w-full flex-col gap-2 md:flex-row">
            <Button variant="error" onClick={onDelete} className="w-full">
              {texts.manageAccount.action.deleteAccount}
            </Button>
            <Button variant="warning" onClick={onArchive} className="w-full">
              {texts.manageAccount.action.archiveAccount}
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
