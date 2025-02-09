import { FC, useMemo } from 'react';

import { cn } from '@/utils/cn';

import Text from '../text/text';
import Title from '../title/title';

type Balance = 'income' | 'outcome';

type CategoryCardProps = {
  category: string;
  description?: string;
  value: number;
  isEdit?: boolean;
  balance?: Balance;
};

const CategoryCard: FC<CategoryCardProps> = ({ category, description, value, isEdit, balance }) => {
  const operationSign = useMemo(() => {
    switch (balance) {
      case 'income':
        return '+';
      case 'outcome':
        return '—';
      default:
        return '';
    }
  }, [balance]);

  return (
    <div
      className={cn(
        'shadow-def flex max-w-72 flex-col gap-2 rounded-lg border border-transparent bg-white px-6 py-4 hover:border hover:border-gray-300 hover:bg-gray-100',
        {
          ['cursor-pointer bg-blue-50']: isEdit,
        }
      )}
    >
      <Text isBold className="line-clamp-1">
        {category}
      </Text>
      <Text variant="sm" className="line-clamp-2 text-gray-500">
        {description}
      </Text>
      <Title
        className={cn({
          ['text-green-500']: balance === 'income',
          ['text-red-500']: balance === 'outcome',
        })}
      >
        {operationSign} {value} ₽
      </Title>
    </div>
  );
};

export default CategoryCard;
