import { useEffect, useState } from 'react';
import { PieChart, Pie as RechartsPie, Cell, Tooltip, Legend } from 'recharts';
import Select from '@/components/base/select/select';
import { OptionType } from '@/pages/transactions/index';

type PieData = {
  categoryName: string;
  totalAmount: number;
  color: string;
};

type PieProps = {
  monthYearOptions: OptionType[];
  selectedMonthYear: OptionType | null;
  setSelectedMonthYear: (option: OptionType | null) => void;
};

const Pie = ({ monthYearOptions, selectedMonthYear, setSelectedMonthYear }: PieProps) => {
  const [data, setData] = useState<PieData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchPieData = async () => {
    if (!selectedMonthYear) return;

    try {
      setLoading(true);
      const res = await fetch(`/api/dpl/pie?monthYear=${selectedMonthYear.value}`);
      const result = await res.json();
      setData(result);
    } catch (error) {
      console.error('Ошибка при загрузке данных для диаграммы:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPieData();
  }, [selectedMonthYear]);

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold mb-4">Расходы по категориям</h2>
      {monthYearOptions.length > 0 && selectedMonthYear && (
        <Select
          label="Период"
          options={monthYearOptions}
          selected={selectedMonthYear}
          onChangeOption={setSelectedMonthYear}
          className="mb-4 w-40"
        />
      )}

      {loading ? (
        <div className="text-center">Загрузка...</div>
      ) : data.length === 0 ? (
        <div className="text-center text-gray-500">Нет данных для отображения</div>
      ) : (
        <PieChart width={600} height={400}>
          <RechartsPie
            data={data}
            dataKey="totalAmount"
            nameKey="categoryName"
            cx="50%"
            cy="50%"
            outerRadius={150} // Внешний радиус диаграммы
            innerRadius={70} // Радиус прозрачного круга внутри (для "пончика")
            label={({ totalAmount }) => `${(totalAmount / 100).toLocaleString('ru-RU')} ₽`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`}
              fill={entry.color}
              stroke="#fff" // Белая обводка для секторов
              strokeWidth={2} />
            ))}
          </RechartsPie>
          <Tooltip formatter={(value: number) => `${(value / 100).toLocaleString('ru-RU')} ₽`} />
          <Legend />
        </PieChart>
      )}
    </div>
  );
};

export default Pie;
