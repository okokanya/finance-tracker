import { useEffect, useState } from 'react';
import Spinner from '@/components/base/spinner';
import Title from '@/components/base/title';
import { getAmountStyle } from '@/components/util/amount-style';

type Transaction = {
  date: string;
  accountName: string | null;
  categoryName: string | null;
  comment: string | null;
  amount: number;
};

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await fetch('/api/transactions-table');
        const data = await res.json();
        setTransactions(data);
        setLoading(false);  // скрыть спиннер
      } catch (error) {
        console.error('Ошибка при загрузке:', error);
        setLoading(false);  // скрыть спиннер
      }
    };

    fetchTransactions();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  return (
    <main className="w-full p-6">
      <Title className="justify-self-start" variant="h1">
        Операции
      </Title>

      <div className="flex justify-between font-semibold text-gray-700 mb-2">
        <div className="w-[12%]">Дата</div>
        <div className="w-[12%]">Счёт</div>
        <div className="w-[25%]">Категория</div>
        <div className="w-[37%]">Комментарий</div>
        <div className="w-[12%]">Сумма</div>
      </div>

      <div>
        {transactions.map((tx, index) => (
          <div key={index} className="flex flex-wrap mb-2 rounded-lg bg-white hover:bg-gray-100 hover:shadow-lg transition-all duration-200">
            <div className="w-[10%]">
              <div>{tx.date}</div>
            </div>
            <div className="w-[10%]">
              <div>{tx.accountName ?? '—'}</div>
            </div>
            <div className="w-[25%]">
              <div>{tx.categoryName ?? '—'}</div>
            </div>
            <div className="w-[37%]">
              <div>{tx.comment ?? '—'}</div>
            </div>
            <div className="w-[10%]">
              <div className={getAmountStyle(tx.amount)}>{tx.amount}</div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
