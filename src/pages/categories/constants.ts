import { OptionType } from '@/components/select/option-type';
import { CategoryType } from '@/types/enums';

export const BALANCE_OPTIONS: OptionType<CategoryType>[] = [
  {
    title: 'Расходы',
    value: 'expense',
  },
  {
    title: 'Доходы',
    value: 'income',
  },
];

export type Period = 'prevMonth' | 'thisMonth';

export const PERIOD_OPTIONS: OptionType<Period>[] = [
  {
    title: 'Прошлый месяц',
    value: 'prevMonth',
  },
  {
    title: 'Этот месяц',
    value: 'thisMonth',
  },
];
