import { useState } from 'react';
import Spinner from '@/components/base/spinner';
import Title from '@/components/base/title';
import Select from '@/components/base/select/select';
import { getAmountStyle } from '@/components/util/amount-style';
import EditTransactionModal from '@/components/transactions/transactions-edit-modal';
import useTransactions from '@/hooks/useTransactions'; // Предполагается, что хук находится в этой папке

type Transaction = {
  id: string;
  date: string;
  accountName: string | null;
  categoryName: string | null;
  comment: string | null;
  amount: number;
  type?: string;
};

const formatNumber = (num: number) => num.toLocaleString('ru-RU');

export default function TransactionsPage() {
  const {
    transactions,
    setTransactions,
    loading,
    error,
    monthYearOptions,
    selectedMonthYear,
    setSelectedMonthYear,
    fetchTransactions,
  } = useTransactions();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  // const handleTransactionUpdate = (updatedTransaction: Transaction) => {
  //   setTransactions((prev) =>
  //     prev.map((tx) => (tx.id === updatedTransaction.id ? updatedTransaction : tx))
  //   );
  // };
  const handleTransactionUpdate = async (updatedTransaction: Transaction): Promise<void> => {
    setTransactions((prev) =>
      prev.map((tx) => (tx.id === updatedTransaction.id ? updatedTransaction : tx))
    );
  };

  const handleTransactionDuplicate = async () => {
    await fetchTransactions();
  };

  const handleTransactionDelete = async () => {
    await fetchTransactions();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner />
      </div>
    );
  }

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

      {error && (
        <div className="text-red-500 text-center mb-4">{error}</div>
      )}

      <div>
        {transactions.length === 0 ? (
          <div className="text-center text-gray-500 mt-8 text-lg">
            В выбранном периоде нет операций
          </div>
        ) : (
          <div className="mb-2 flex flex-wrap font-semibold p-2">
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
          onDeleteSuccess={handleTransactionDelete}
          onDuplicateSuccess={handleTransactionDuplicate}
          title="Редактирование операции"
          transaction={selectedTransaction}
        />
      )}
    </main>
  );
}
