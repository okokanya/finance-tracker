import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

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
import { AccountType } from '@/types/enums';

type Props = Omit<ModalProps, 'title' | 'children'> & {
  onSuccess: (account: AccountFormSuccessResult) => void;
};

export default function AddAccountModal({ isOpen, onClose, onSuccess }: Props) {
  const [selectedType, setSelectedType] = useState<OptionType<AccountType>>(ACCOUNT_OPTIONS[0]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AccountForm>({
    resolver: zodResolver(accountFormSchema),
  });

  const onSubmit = (data: AccountForm) => {
    onSuccess({
      name: data.name,
      description: data.description,
      type: selectedType.value,
      balance: data.balance,
      isArchived: false,
    });
    reset();
    onClose();
  };

  return (
    <Modal title={texts.addAccount.action.title} isOpen={isOpen} onClose={onClose}>
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
        </div>
        <div className="flex w-full gap-2">
          <Button type="submit" className="w-4/5">
            {texts.addAccount.action.create}
          </Button>
          <Button variant="secondary" onClick={onClose}>
            {texts.cancel}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
