import { useEffect, useState } from 'react';
import Spinner from '@/components/base/spinner';

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
        {/* Используем твой компонент Spinner */}
        <Spinner />
      </div>
    );
  }

  return (
    <main className="p-4">
      {/* Заголовки */}
      <div className="flex justify-between mb-4 text-sm font-semibold text-gray-600">
        <div className="flex-1">Дата</div>
        <div className="flex-1">Счёт</div>
        <div className="flex-1">Категория</div>
        <div className="flex-1">Комментарий</div>
        <div className="flex-1">Сумма</div>
      </div>

      {/* Список транзакций */}
      <div className="space-y-6">
        {transactions.map((tx, index) => (
          <div key={index} className="flex flex-wrap gap-4 p-4 border rounded-lg shadow-md">
            <div className="flex-1">
              <div>{tx.date}</div>
            </div>
            <div className="flex-1">
              <div>{tx.accountName ?? '—'}</div>
            </div>
            <div className="flex-1">
              <div>{tx.categoryName ?? '—'}</div>
            </div>
            <div className="flex-1">
              <div>{tx.comment ?? '—'}</div>
            </div>
            <div className="flex-1">
              <div>{tx.amount}</div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
