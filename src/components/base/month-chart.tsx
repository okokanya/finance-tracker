import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { cn } from '@/utils/cn';
import { getMonthName } from '@/utils/format-month';

import Text from './text';

interface FinancialChartProps {
  chartType: 'income' | 'expense';
  data: { day: number; value: number }[];
  averageValue: number;
  monthNumber: number;
}

// Настройки стилей в зависимости от типа графика
const chartConfig = {
  income: {
    color: '#10b981',
    darkColor: '#059669',
    label: 'Доход',
  },
  expense: {
    color: '#ef4444',
    darkColor: '#dc2626',
    label: 'Расход',
  },
};

export default function MonthChart({
  chartType,
  data,
  averageValue,
  monthNumber,
}: FinancialChartProps) {
  // Создаем полный массив данных на 30 дней
  const chartData = Array.from({ length: 30 }, (_, index) => {
    const day = index + 1;
    const value = data.find(item => item.day === day)?.value || 0;
    return { day, value, average: averageValue };
  });

  const month = getMonthName(monthNumber);

  return (
    <div className="w-full rounded-xl bg-white p-6 shadow-sm">
      <div className="h-80">
        <Text variant="sm" isBold className={cn('mb-2')}>
          {chartConfig[chartType].label}
        </Text>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 5, left: 5, bottom: 12 }}
            title={chartConfig[chartType].label}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />

            <XAxis
              dataKey="day"
              tick={{ fill: '#666' }}
              tickLine={{ stroke: '#ddd' }}
              axisLine={{ stroke: '#ddd' }}
              tickSize={12}
            />

            <YAxis
              tick={{ fill: '#666' }}
              tickLine={{ stroke: '#ddd' }}
              axisLine={{ stroke: '#ddd' }}
              tickFormatter={value => value.toLocaleString()}
              tickSize={12}
              dy={-5}
            />

            <Tooltip
              contentStyle={{
                background: '#fff',
                border: '1px solid #eee',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              }}
              formatter={value => [`${value.toLocaleString()} ₽`, chartConfig[chartType].label]}
              labelFormatter={label => `${label} ${month}`}
            />

            <Line
              type="monotone"
              dataKey="value"
              stroke={chartConfig[chartType].color}
              strokeWidth={2}
              dot={{ fill: chartConfig[chartType].darkColor, r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
