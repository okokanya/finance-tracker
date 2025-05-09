import { useEffect, useState } from 'react';
import { PieChart, Pie as RechartsPie, Cell, Tooltip, Legend, LegendProps } from 'recharts';
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

  const totalSum = data.reduce((sum, entry) => sum + entry.totalAmount, 0);

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

  // Центрированный текст с общей суммой
  const renderCenterLabel = () => {
    return (
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="20"
        fontWeight="bold"
      >
        {(totalSum / 100).toLocaleString('ru-RU')} ₽
      </text>
    );
  };

  // Кастомная легенда с процентами
  const renderCustomLegend = (props: LegendProps) => {
    return (
      <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
        {data.map((entry, index) => {
          const percent = totalSum > 0 ? (entry.totalAmount / totalSum) * 100 : 0;
          return (
            <li key={`item-${index}`} style={{ marginBottom: 4, display: 'flex', alignItems: 'center' }}>
              <div
                style={{
                  width: 12,
                  height: 12,
                  backgroundColor: entry.color,
                  marginRight: 8,
                  borderRadius: 2,
                }}
              />
              <span>
                {entry.categoryName} — {percent.toFixed(1)}%
              </span>
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold mb-4">Расходы по категориям</h2>
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
            outerRadius={150}
            innerRadius={70}
            labelLine={false}
            label={({ totalAmount }) => `${(totalAmount / 100).toLocaleString('ru-RU')} ₽`}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.color}
                stroke="#fff"
                strokeWidth={2}
              />
            ))}
          </RechartsPie>
          {renderCenterLabel()}
          <Tooltip formatter={(value: number) => `${(value / 100).toLocaleString('ru-RU')} ₽`} />
          <Legend content={renderCustomLegend} />
        </PieChart>
      )}
    </div>
  );
};

export default Pie;
