import { useEffect, useState } from 'react';
import Spinner from '@/components/base/spinner';
import Title from '@/components/base/title';


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
    <main className="p-4">
      <Title className="justify-self-start" variant="h1">
        Категории
      </Title>
      {/* Заголовки */}
      <div className="flex justify-between mb-4 text-sm font-semibold text-gray-600">
        <div className="flex-1">Дата</div>
        <div className="flex-1">Счёт</div>
        <div className="flex-1">Категория</div>
        <div className="flex-1">Комментарий</div>
        <div className="flex-1">Сумма</div>
      </div>

      {/* Список транзакций */}
      <div>
        {transactions.map((tx, index) => (
          <div key={index} className="flex flex-wrap gap-2 p-4 border rounded-lg">
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
