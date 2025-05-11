import { FC, useMemo } from 'react';

import Text from '@/components/base/text';
import { cn } from '@/utils/cn';

// Новый тип пропсов для отчетной карточки
// Изменено: type теперь 'topup' | 'withdrawal'
interface ReportCategoryProps {
  category: string;
  value: number;
  percent: number; // процент от общего пополнения/вывода
  type: 'topup' | 'withdrawal';
  onClick?: () => void;
  className?: string;
}

const ReportCategory: FC<ReportCategoryProps> = ({
  category,
  value,
  percent,
  type,
  onClick,
  className,
}) => {
  const operationSign = useMemo(() => {
    switch (type) {

      case 'withdrawal':
        return '—';
      case 'topup':
      default:
        return '';
    }
  }, [type]);

  return (
    <div
      className={cn(
        'uikit-card-shadow flex flex-col gap-2 rounded-lg w-[335px] min-w-[335px] px-4 py-3 border border-transparent bg-white hover:border hover:border-gray-300 hover:bg-gray-100',
        'md:max-w-72 md:min-w-0 md:px-6 md:py-4',
        className,
        {
          'cursor-pointer': onClick,
        }
      )}
      onClick={onClick}
    >
      <Text isBold className="line-clamp-1">
        {category}
      </Text>
      <div className='flex flex-row justify-between items-center'>
        <Text variant="sm" className="text-gray-500">
          Сумма
        </Text>
        <Text variant='sm' isBold
          className={cn({
            ['text-green-500']: type === 'topup',
            ['text-red-500']: type === 'withdrawal',
          })}
        >
          {operationSign} {value} ₽
        </Text>
      </div>
      <Text
        variant="sm"
        className={cn('font-bold', {
          ['text-green-500']: type === 'topup',
          ['text-red-500']: type === 'withdrawal',
        })}
      >
        {percent}% {type === 'topup' ? 'от общего дохода' : 'от общего расхода'}
      </Text>
    </div>
  );
};

export default ReportCategory;
