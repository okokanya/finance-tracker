import Text from '@/components/base/text';
import { cn } from '@/utils/cn';
import { FC } from 'react';

interface ReportAveragesProps {
  type: 'topup' | 'withdrawal';
  title: string;
  values: {
    label: string;
    value: number;
  }[];
  className?: string;
}

const bgColor: Record<'topup' | 'withdrawal', string> = {
  topup: 'bg-green-50',
  withdrawal: 'bg-red-50',
};

const valueColor: Record<'topup' | 'withdrawal', string> = {
  topup: 'text-green-600',
  withdrawal: 'text-red-500',
};

const ReportAverages: FC<ReportAveragesProps> = ({ type, title, values, className }) => {
  return (
    <div
      className={cn(
        'rounded-lg w-[335px] min-w-[335px] px-4 py-3 flex flex-col gap-2',
        'md:rounded-xl md:w-full md:min-w-0 md:px-8 md:py-4 md:gap-2',
        bgColor[type],
        className
      )}
    >
      <Text isBold className="text-center mb-1 md:mb-1">
        {title}
      </Text>
      <div className="flex flex-col gap-y-1 items-start md:flex-row md:flex-wrap md:gap-x-4 md:gap-y-1 md:justify-center md:items-center">
        {values.map(({ label, value }, idx) => (
          <div key={idx} className="flex flex-row gap-1 items-center">
            <Text variant="sm" className="text-gray-500">
              {label}
            </Text>
            <Text variant="sm" isBold className={valueColor[type]}>
              {value.toLocaleString()} ₽
            </Text>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReportAverages;
