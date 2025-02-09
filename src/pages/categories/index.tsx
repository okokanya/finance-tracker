import { useState } from 'react';

import Button from '@/components/button';
import Select from '@/components/select/select';
import Title from '@/components/title/title';
import { CategoryType } from '@/types/enums';

import { BALANCE_OPTIONS, Period, PERIOD_OPTIONS } from './constants';

Categories.title = 'Категории';

export default function Categories() {
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedBalance, setSelectedBalance] = useState<CategoryType>('expense');
  const [selectedPeriod, setSelectedPeriod] = useState<Period>('thisMonth');

  return (
    <section className="mt-10 w-full">
      <Title className="justify-self-start" variant="h1">
        Категории
      </Title>
      <div className="flex justify-between">
        <Button onClick={() => setIsEditMode(prev => !prev)}>Режим редактирования</Button>
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
