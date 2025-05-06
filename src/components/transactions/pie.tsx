import { OptionType } from '@/pages/transactions/index'; // Импортируем тип из TransactionsPage

interface PieProps {
  monthYearOptions: OptionType[];
  selectedMonthYear: OptionType | null;
  setSelectedMonthYear: (option: OptionType | null) => void;
}

const Pie = ({ selectedMonthYear }: PieProps) => {
  return (
    <div>
      <h1>Pie</h1>
      {selectedMonthYear ? (
        <p>Выбранный период: {selectedMonthYear.title}</p>
      ) : (
        <p>Период не выбран</p>
      )}
    </div>
  );
};

export default Pie;
