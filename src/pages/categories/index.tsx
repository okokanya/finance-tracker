import { useState } from 'react';

import Button from '@/components/button';
import Select from '@/components/select/select';
import Text from '@/components/text/text';
import Title from '@/components/title/title';
import { CategoryType } from '@/types/enums';

import { BALANCE_OPTIONS, Period, PERIOD_OPTIONS } from './constants';

Categories.title = 'Категории';

export default function Categories() {
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedBalance, setSelectedBalance] = useState<CategoryType>('expense');
  const [selectedPeriod, setSelectedPeriod] = useState<Period>('thisMonth');

  const handleMainButtonClick = (save?: boolean) => {
    if (save) {
      // TODO: implement saving
    }

    setIsEditMode(prev => !prev);
  };

  const handleCancel = () => {
    setIsEditMode(false);
  };

  return (
    <section className="mt-10 w-full">
      <div className="mb-6 flex gap-2">
        <Title className="justify-self-start" variant="h1">
          Категории
        </Title>
        {isEditMode ? (
          <Text className={'mt-[10px] text-blue-500'}>Режим редактирования</Text>
        ) : null}
      </div>
      <div className="flex justify-between">
        <div className="flex gap-2">
          <Button onClick={() => handleMainButtonClick(isEditMode)}>
            {!isEditMode ? 'Режим редактирования' : 'Сохранить изменения'}
          </Button>
          {isEditMode ? (
            <Button variant="secondary" onClick={handleCancel}>
              Отменить
            </Button>
          ) : null}
        </div>
        <div className="flex gap-2">
          <Select
            options={BALANCE_OPTIONS}
            selected={selectedBalance}
            onChangeOption={selected => setSelectedBalance(selected.value as CategoryType)}
          />
          <Select
            options={PERIOD_OPTIONS}
            selected={selectedPeriod}
            onChangeOption={selected => setSelectedPeriod(selected.value as Period)}
          />
        </div>
      </div>
    </section>
  );
}
