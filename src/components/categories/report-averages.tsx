import { FC } from 'react';

import Text from '@/components/base/text';
import { cn } from '@/utils/cn';

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
        'flex w-[335px] min-w-[335px] flex-col gap-2 rounded-lg px-4 py-3',
        'md:w-full md:min-w-0 md:gap-2 md:rounded-xl md:px-8 md:py-4',
        bgColor[type],
        className
      )}
    >
      <Text isBold className="mb-1 text-center md:mb-1">
        {title}
      </Text>
      <div className="flex flex-col items-start gap-y-1 md:flex-row md:flex-wrap md:items-center md:justify-center md:gap-x-4 md:gap-y-1">
        {values.map(({ label, value }, idx) => (
          <div key={idx} className="flex flex-row items-center gap-1">
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
