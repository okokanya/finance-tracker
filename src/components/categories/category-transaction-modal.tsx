import { useEffect, useMemo, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { DateTime } from 'luxon';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';

import { useCategoriesTransactions } from '@/features/category/category.queries';
import { useCategoriesStore } from '@/features/category/category.store';
import { texts } from '@/features/category/category.texts';
import { TransactionFormData } from '@/features/category/category.types';
import useAddCategoryTransaction from '@/features/category/controllers/add-category-transaction';
import { CategoryType, transactionSchema } from '@/models';
import { cn } from '@/utils/cn';

import AmountInput from '../base/amount-input';
import Button from '../base/button';
import DatePicker from '../base/date-picker';
import Input from '../base/input';
import Modal from '../base/modal';
import { OptionType } from '../base/select/option-type';
import Select from '../base/select/select';

export default function CategoryTransactionModal() {
  const {
    isTransactionModalOpen,
    setIsTransactionModalOpen,
    selectedCategory,
    setSelectedCategory,
  } = useCategoriesStore(store => store);

  const now = DateTime.now().setLocale('ru');

  const currentDate = {
    day: now.day,
    month: now.month,
    year: now.year,
  };

  const [categoryType, setCategoryType] = useState<CategoryType>();

  const currentType: TransactionFormData['type'] = useMemo(
    () => (categoryType === 'expense' ? 'withdrawal' : 'topup'),
    [categoryType]
  );

  const { categoriesOptions, accountsOptions, isLoading, categories } = useCategoriesTransactions({
    type: categoryType,
  });
  const [category, setCategory] = useState<OptionType>({
    title: selectedCategory?.name ?? '',
    value: selectedCategory?.id ?? '',
  });
  const [account, setAccount] = useState<OptionType>(accountsOptions[0]);

  useEffect(() => {
    if (selectedCategory) {
      handleChangeCategory({ title: selectedCategory.name, value: selectedCategory.id });
    } else if (categoriesOptions.length) {
      handleChangeCategory(categoriesOptions[0]);
    }
  }, [categoriesOptions, selectedCategory]);

  useEffect(() => {
    if (accountsOptions.length) {
      handleChangeAccount(accountsOptions[0]);
    }
  }, [accountsOptions]);

  const methods = useForm<TransactionFormData>({
    resolver: zodResolver(
      transactionSchema
        .omit({
          id: true,
          userId: true,
          createdAt: true,
          updatedAt: true,
          targetAccountId: true,
        })
        .extend({
          day: z.number().min(1).max(31),
          month: z.number().min(1).max(12),
          year: z.number().min(2000).max(2100),
        })
    ),
    defaultValues: {
      type: currentType,
      day: currentDate.day,
      month: currentDate.month,
      year: currentDate.year,
      amount: undefined,
      comment: '',
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = methods;

  const { mutate } = useAddCategoryTransaction();

  const onSubmit = (data: TransactionFormData) => {
    console.log(data);
    mutate(data, {
      onSuccess: () => {
        handleClose();
      },
    });
  };

  const handleChangeCategory = (selected: OptionType) => {
    const currentCategory = categories?.find(cat => cat.id === selected.value);
    if (currentCategory) {
      setCategoryType(currentCategory.type);
    }

    setCategory(selected);
    setValue('categoryId', selected?.value);
  };

  const handleChangeAccount = (selected: OptionType) => {
    setAccount(selected);
    setValue('accountId', selected.value);
  };

  const handleClose = () => {
    reset();
    setIsTransactionModalOpen(false);
    setSelectedCategory(null);
  };

  if (isLoading) {
    return <></>;
  }

  return (
    <Modal title={texts.transactions.title} isOpen={isTransactionModalOpen} onClose={handleClose}>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input type="hidden" {...register('type')} />
          {errors.type?.message}
          <div className="flex w-full gap-4">
            <Select
              label="Выберите счёт"
              options={accountsOptions}
              selected={account}
              onChangeOption={handleChangeAccount}
              {...register('accountId')}
              wrapperClassName={cn('w-full')}
              errorText={errors.accountId?.message}
            />
            <Select
              label="Категория"
              options={categoriesOptions}
              selected={category}
              onChangeOption={handleChangeCategory}
              {...register('categoryId', {})}
              wrapperClassName={cn('w-full')}
              errorText={errors.categoryId?.message}
            />
          </div>
          <div className="flex w-full gap-4">
            <AmountInput
              label="Сумма"
              placeholder="500 ₽"
              errorText={errors.amount?.message}
              {...register('amount')}
              className={cn('w-48')}
              onAmountChanged={value => setValue('amount', value)}
            />

            <DatePicker />
          </div>

          <Input
            label="Комментарий"
            placeholder="Оплата обеда"
            {...register('comment')}
            errorText={errors.comment?.message}
          />

          <div className="mt-6 flex justify-end space-x-4">
            <Button type="submit" variant="primary">
              {texts.transactions.add}
            </Button>
            <Button onClick={handleClose} variant="secondary">
              {texts.transactions.cancel}
            </Button>
          </div>
        </form>
      </FormProvider>
    </Modal>
  );
}
