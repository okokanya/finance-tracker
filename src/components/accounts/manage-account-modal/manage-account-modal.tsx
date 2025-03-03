import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import TransactionList from '@/components/accounts/manage-account-modal/transaction-list';
import Button from '@/components/button';
import Input from '@/components/input/input';
import Modal, { ModalProps } from '@/components/modal/modal';
import { OptionType } from '@/components/select/option-type';
import Select from '@/components/select/select';
import { ACCOUNT_OPTIONS } from '@/features/accounts/accounts.constants';
import texts from '@/features/accounts/accounts.texts';
import {
  AccountForm,
  accountFormSchema,
  AccountFormSuccessResult,
} from '@/features/accounts/accounts.types';
import { hasAccountChanges } from '@/features/accounts/accounts.utils';
import { useManageAccountController } from '@/features/accounts/controllers/manage-account.controller';
import { Account } from '@/models';
import { AccountType } from '@/types/enums';

type ManageAccountModalProps = Omit<ModalProps, 'title' | 'children'> & {
  account: Account;
  onUpdate: (account: AccountFormSuccessResult) => void;
  onDelete: () => void;
  onArchive: () => void;
};

const ManageAccountModal: React.FC<ManageAccountModalProps> = ({
  account,
  isOpen,
  onClose,
  onUpdate,
  onDelete,
  onArchive,
}) => {
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
  } = useForm<AccountForm>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: {
      name: account.name,
      description: account.description ?? '',
      balance: account.balance,
    },
  });

  const formValues = watch();
  const hasChanges = hasAccountChanges(account, {
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
      <form onSubmit={handleSubmit(onSubmit)} className="flex w-full flex-col gap-6">
        <div className="mt-3 flex w-full flex-col gap-4">
          <div className="flex w-full flex-wrap justify-stretch gap-4">
            <Input
              label={texts.accountParams.nameTitle}
              placeholder={texts.accountParams.namePlaceholder}
              wrapperClassName="w-full min-w-[262px] flex-1"
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
              wrapperClassName="w-full min-w-[262px] flex-1"
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
          <Input
            label={texts.accountParams.balanceTitle}
            placeholder={texts.accountParams.balancePlaceholder}
            wrapperClassName="w-full"
            className="w-full"
            errorText={errors?.balance?.message}
            type="text"
            {...register('balance', { valueAsNumber: true })}
          />
          <TransactionList
            transactions={transactions}
            isLoading={isLoadingTransactions}
            isError={isTransactionsError}
            repeatOnError={refetchTransactions}
          />
        </div>
        <div className="flex w-full flex-col gap-2">
          <Button type="submit" className="w-full" disabled={!hasChanges}>
            {texts.manageAccount.action.updateAccount}
          </Button>
          <div className="flex w-full gap-2">
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
};

export default ManageAccountModal;
