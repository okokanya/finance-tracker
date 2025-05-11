import { FC, useMemo } from 'react';

import Text from '@/components/base/text';
import Title from '@/components/base/title';
import { CategoryType } from '@/types/enums';
import { cn } from '@/utils/cn';

type CategoryCardProps = {
  category: string;
  description?: string | null;
  value: number;
  isEdit?: boolean;
  type?: CategoryType;
  onClick: () => void;
};

const CategoryCard: FC<CategoryCardProps> = ({
  category,
  description,
  value,
  isEdit,
  type,
  onClick,
}) => {
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
        'uikit-card-shadow flex flex-col gap-2 rounded-lg w-[335px] min-w-[335px] px-4 py-3 border border-transparent bg-white cursor-pointer hover:border hover:border-gray-300 hover:bg-gray-100',
        'md:max-w-72 md:min-w-0 md:px-6 md:py-4',
        {
          ['bg-blue-50']: isEdit,
        }
      )}
      onClick={onClick}
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
