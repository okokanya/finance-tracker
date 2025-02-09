import { FC, useMemo } from 'react';

import { CategoryType } from '@/types/enums';
import { cn } from '@/utils/cn';

import Text from '../text/text';
import Title from '../title/title';

type CategoryCardProps = {
  category: string;
  description?: string;
  value: number;
  isEdit?: boolean;
  type?: CategoryType;
};

const CategoryCard: FC<CategoryCardProps> = ({ category, description, value, isEdit, type }) => {
  const operationSign = useMemo(() => {
    switch (type) {
      case 'income':
        return '+';
      case 'expense':
        return '—';
      default:
        return '';
    }
  }, [type]);

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
          ['text-green-500']: type === 'income',
          ['text-red-500']: type === 'expense',
        })}
      >
        {operationSign} {value} ₽
      </Title>
    </div>
  );
};

export default CategoryCard;
