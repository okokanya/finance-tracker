import { useEffect, useState } from 'react';
import MainWrap from '@/components/main-wrap';
import TransactiosTable from '@/components/transactios-table';
import Spinner from '@/components/base/spinner/spinner';

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        // получение транзакций
        const transactionsResponse = await fetch('/api/transactions');
        if (!transactionsResponse.ok) {
          throw new Error('Failed to fetch transactions');
        }
        const transactionsData = await transactionsResponse.json();
        setTransactions(transactionsData);

        //  получение категорий
        const categoriesResponse = await fetch('/api/categories', {
          method: 'GET',
        });
        if (!categoriesResponse.ok) {
          throw new Error('Failed to fetch categories');
        }
        const categoriesData = await categoriesResponse.json();
        console.log('Categories:', categoriesData); // Выводим все данные категорий в консоль
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    if (transactions.length > 0) {
      console.log('Transactions:', transactions);
    }
  }, [transactions]);

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <MainWrap>
      <h1>Операции</h1>
      <TransactiosTable
        transactions={transactions}
        className="my-custom-class"
      />
    </MainWrap>
  );
}

export async function getServerSideProps() {
  return {
    props: {
      title: 'Операции',
    },
  };
}
