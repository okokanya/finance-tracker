import { useEffect, useState } from 'react';
import Spinner from '@/components/base/spinner';
import Title from '@/components/base/title';
import Select from '@/components/base/select/select';
import { getAmountStyle } from '@/components/util/amount-style';
import EditTransactionModal from '@/components/transactions/transactions-edit-modal';

type Transaction = {
  id: string;
  date: string;
  accountName: string | null;
  categoryName: string | null;
  comment: string | null;
  amount: number;
  type: string;
};

type OptionType = {
  value: string;
  title: string;
};

const formatNumber = (num: number) => num.toLocaleString('ru-RU');

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [monthYearOptions, setMonthYearOptions] = useState<OptionType[]>([]);
  const [selectedMonthYear, setSelectedMonthYear] = useState<OptionType | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  const fetchMonthYearList = async () => {
    try {
      const res = await fetch('/api/transactions/transactions-list');
      const { data } = await res.json();
      setMonthYearOptions(data.map((ym: string) => ({
        value: ym,
        title: ym
      })));
      if (data.length > 0) setSelectedMonthYear({ value: data[0], title: data[0] });
    } catch (error) {
      console.error('Error loading months:', error);
    }
  };

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const url = selectedMonthYear
        ? `/api/transactions/transactions-table?monthYear=${selectedMonthYear.value}`
        : '/api/transactions/transactions-table';

      const res = await fetch(url);
      const data = await res.json();
      setTransactions(data);
    } catch (error) {
      console.error('Error loading transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMonthYearList();
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [selectedMonthYear]);

  const handleTransactionUpdate = (updatedTransaction: Transaction) => {
    setTransactions(prev => prev.map(tx =>
      tx.id === updatedTransaction.id ? updatedTransaction : tx
    ));
  };

  const handleTransactionDuplicate = async () => {
    await fetchTransactions();
    // Можно добавить уведомление об успешном дублировании
  };

  if (loading) return <div className="flex justify-center items-center min-h-screen"><Spinner /></div>;

  return (
    <main className="w-full p-6">
      <Title variant="h1">Операции</Title>

      {monthYearOptions.length > 0 && selectedMonthYear && (
        <Select
          label="Период"
          options={monthYearOptions}
          selected={selectedMonthYear}
          onChangeOption={setSelectedMonthYear}
          className="mb-4 w-40"
        />
      )}

      <div>
        {transactions.length === 0 ? (
          <div className="text-center text-gray-500 mt-8 text-lg">
            В выбранном периоде нет операций
          </div>
        ) : (
          <div className="mb-2 flex flex-wrap font-semibold p-2">
            <div className="w-[8%]">ID</div>
            <div className="w-[10%]">Дата</div>
            <div className="w-[15%]">Счёт</div>
            <div className="w-[25%]">Категория</div>
            <div className="w-[30%]">Комментарий</div>
            <div className="w-[10%] text-right">Сумма</div>
          </div>
        )}
        {transactions.map((tx) => (
          <div
            key={tx.id}
            onClick={() => {
              setSelectedTransaction(tx);
              setIsModalOpen(true);
            }}
            className="flex flex-wrap mb-2 rounded-lg bg-white hover:bg-gray-100 hover:shadow-lg transition-all duration-200 cursor-pointer"
          >
            <div className="flex p-2 items-center w-[8%] text-gray-500 text-sm">{tx.id}</div>
            <div className="flex p-2 items-center w-[10%]">{tx.date}</div>
            <div className="flex p-2 items-center w-[15%]">{tx.accountName ?? '—'}</div>
            <div className="flex p-2 items-center w-[25%]">{tx.categoryName ?? '—'}</div>
            <div className="flex p-2 items-center w-[30%]">{tx.comment ?? '—'}</div>
            <div className="flex p-2 items-center w-[10%] justify-end">
              <div className={getAmountStyle(tx.amount)}>{formatNumber(tx.amount)}</div>
            </div>
          </div>
        ))}
      </div>

      {selectedTransaction && (
        <EditTransactionModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSaveSuccess={handleTransactionUpdate}
          onDuplicateSuccess={handleTransactionDuplicate}
          title="Редактирование операции"
          transaction={selectedTransaction}
        />
      )}
    </main>
  );
}
