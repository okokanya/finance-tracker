// components/transactions/table.tsx
import { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LegendProps,
} from 'recharts';
import { OptionType } from '@/pages/transactions/index';

type BarData = {
  day: string; // Например, "2025-04-01"
  totalAmount: number; // Сумма в копейках
};

type TableProps = {
  monthYearOptions: OptionType[];
  selectedMonthYear: OptionType | null;
  setSelectedMonthYear: (option: OptionType | null) => void;
};

const Table = ({ monthYearOptions, selectedMonthYear, setSelectedMonthYear }: TableProps) => {
  const [data, setData] = useState<BarData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Вычисляем общую сумму для отображения в легенде
  const totalSum = data.reduce((sum, entry) => sum + entry.totalAmount, 0);

  // Функция для генерации всех дней месяца
  const generateMonthDays = (year: number, month: number): string[] => {
    const daysInMonth = new Date(year, month, 0).getDate();
    const days: string[] = [];
    for (let day = 1; day <= daysInMonth; day++) {
      const formattedDay = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
      days.push(formattedDay);
    }
    return days;
  };

  // Загрузка данных из API и дополнение всех дней
  const fetchBarData = async () => {
    if (!selectedMonthYear) {
      setData([]);
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`/api/dpl/bar?monthYear=${selectedMonthYear.value}`);
      if (!res.ok) throw new Error(`HTTP ошибка: ${res.status}`);
      const apiData: BarData[] = await res.json();

      // Парсим year и month из selectedMonthYear (например, "2025-04")
      const [year, month] = selectedMonthYear.value.split('-').map(Number);

      // Генерируем все дни месяца
      const allDays = generateMonthDays(year, month);

      // Создаем карту данных из API для быстрого доступа
      const dataMap = new Map(apiData.map((item) => [item.day, item.totalAmount]));

      // Дополняем данные, включая все дни
      const fullData: BarData[] = allDays.map((day) => ({
        day,
        totalAmount: dataMap.get(day) || 0, // 0 для дней без трат
      }));

      setData(fullData);
    } catch (error) {
      console.error('Ошибка при загрузке данных для столбчатой диаграммы:', error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBarData();
  }, [selectedMonthYear]);

  // Форматирование оси X (показываем только день, например, "01", "02")
  const formatXAxis = (tick: string) => tick.split('-')[2];

  // Форматирование оси Y (в рублях)
  const formatYAxis = (value: number) => `${(value / 100).toLocaleString('ru-RU')} ₽`;

  // Кастомная легенда с общей суммой
  const renderCustomLegend = (props: LegendProps) => (
    <div style={{ marginTop: 10, textAlign: 'center' }}>
      <span style={{ fontWeight: 'bold' }}>
        Итого: {(totalSum / 100).toLocaleString('ru-RU')} ₽
      </span>
    </div>
  );

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold mb-4">Расходы по дням</h2>
      {loading ? (
        <div className="text-center">Загрузка...</div>
      ) : data.length === 0 ? (
        <div className="text-center text-gray-500">Нет данных для отображения</div>
      ) : (
        <BarChart
          width={600}
          height={400}
          data={data}
          margin={{ top: 20, right: 30, left: 50, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" tickFormatter={formatXAxis} />
          <YAxis tickFormatter={formatYAxis} />
          <Tooltip
            formatter={(value: number) => `${(value / 100).toLocaleString('ru-RU')} ₽`}
            labelFormatter={(label: string) => `День: ${label.split('-')[2]}`}
          />
          <Legend content={renderCustomLegend} />
          <Bar
            dataKey="totalAmount"
            fill="#8884d8" // Ровная заливка
            radius={[4, 4, 0, 0]}
            label={{
              position: 'top',
              formatter: (value: number) =>
                value > 0 ? `${(value / 100).toLocaleString('ru-RU')} ₽` : '',
              fill: '#000',
              fontSize: 12,
            }}
          />
        </BarChart>
      )}
    </div>
  );
};

export default Table;
