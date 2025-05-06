import { OptionType } from '@/pages/transactions/index';

interface TableProps {
  monthYearOptions: OptionType[];
  selectedMonthYear: OptionType | null;
  setSelectedMonthYear: (option: OptionType | null) => void;
}

const Table = ({ selectedMonthYear }: TableProps) => {
  return (
    <div>
      <h1>Table</h1>
      {selectedMonthYear ? (
        <p>Выбранный период: {selectedMonthYear.title}</p>
      ) : (
        <p>Период не выбран</p>
      )}
    </div>
  );
};

export default Table;
