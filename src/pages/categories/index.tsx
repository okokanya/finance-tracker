import { useState } from 'react';

import Button from '@/components/base/button';
import { OptionType } from '@/components/base/select/option-type';
import Select from '@/components/base/select/select';
import Text from '@/components/base/text';
import Title from '@/components/base/title';
import CategoryCard from '@/components/categories/category-card';
import CategoryEditModal from '@/components/categories/category-edit-modal';
import CategoryModal from '@/components/categories/category-modal';
import CategoryTransactionModal from '@/components/categories/category-transaction-modal';
import NewCategory from '@/components/categories/new-category';
import { BALANCE_OPTIONS, Period, PERIOD_OPTIONS } from '@/features/category/category.constants';
import useCategories from '@/features/category/category.queries';
import { useCategoriesStore } from '@/features/category/category.store';
import { Category } from '@/models';
import { CategoryType } from '@/types/enums';
import { cn } from '@/utils/cn';

export default function Categories() {
  const {
    isEdit,
    setIsEdit,
    setIsCreateModalOpen,
    isCreateModalOpen,
    setIsEditModalOpen,
    setSelectedCategory,
    isEditModalOpen,
    setIsTransactionModalOpen,
  } = useCategoriesStore(store => store);

  const [selectedBalance, setSelectedBalance] = useState<OptionType<CategoryType>>(
    BALANCE_OPTIONS[0]
  );
  const [selectedPeriod, setSelectedPeriod] = useState<OptionType<Period>>(PERIOD_OPTIONS[1]);

  const {
    data: categories,
    isPending,
    error,
  } = useCategories({ type: selectedBalance.value, period: selectedPeriod.value });

  const handleMainButtonClick = () => {
    setIsEdit(!isEdit);
  };

  const handleCancel = () => {
    setIsEdit(false);
  };

  const handleEditCategory = (category: Category) => {
    setIsEditModalOpen(true);
    setSelectedCategory(category);
  };

  const handleCloseEditCategory = () => {
    setSelectedCategory(null);
    setIsEditModalOpen(false);
  };

  const handleCategoryClick = (category: Category) => {
    if (isEdit) {
      handleEditCategory(category);
    } else {
      setIsTransactionModalOpen(true);
      setSelectedCategory(category);
    }
  };

  if (isPending) return <span>Загрузка...</span>;

  if (error) return <span>Error: {error.message}</span>;

  return (
    <section className="mt-10 w-full">
      <div className="mb-6 flex gap-2">
        <Title className="justify-self-start" variant="h1">
          Категории
        </Title>
        {isEdit ? <Text className={'mt-[10px] text-blue-500'}>Режим редактирования</Text> : null}
      </div>
      <div className="mb-2 flex justify-between">
        <div className="flex gap-2">
          <Button onClick={() => handleMainButtonClick()}>
            {!isEdit ? 'Режим редактирования' : 'Сохранить изменения'}
          </Button>
          {isEdit ? (
            <Button variant="secondary" onClick={handleCancel}>
              Отменить
            </Button>
          ) : null}
        </div>
        <div className="flex gap-2">
          <Select
            options={BALANCE_OPTIONS}
            selected={selectedBalance}
            onChangeOption={selected => setSelectedBalance(selected as OptionType<CategoryType>)}
          />
          <Select
            options={PERIOD_OPTIONS}
            selected={selectedPeriod}
            onChangeOption={selected => setSelectedPeriod(selected as OptionType<Period>)}
          />
        </div>
      </div>
      <div className={cn('grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-4')}>
        {categories.data?.length ? (
          categories.data.map(category => (
            <CategoryCard
              key={category.id}
              category={category.name}
              description={category.description}
              value={category.totalAmount}
              type={category.type}
              isEdit={isEdit}
              onClick={() => handleCategoryClick(category)}
            />
          ))
        ) : (
          <div className={cn('w-full text-center')}>Нет категорий</div>
        )}
        {isEdit ? <NewCategory onClick={() => setIsCreateModalOpen(true)} /> : null}
      </div>
      <CategoryModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        type={selectedBalance.value}
      />
      <CategoryEditModal isOpen={isEditModalOpen} onClose={handleCloseEditCategory} />
      <CategoryTransactionModal  categoryType={selectedBalance.value} />
    </section>
  );
}

export async function getServerSideProps() {
  return {
    props: {
      title: 'Категории',
    },
  };
}
