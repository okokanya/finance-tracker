import { useEffect, useState } from 'react';
import MainWrap from '@/components/main-wrap';

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchTransactions() {
      try {
        const response = await fetch('/api/transactions');
        if (!response.ok) {
          throw new Error('Failed to fetch transactions');
        }
        const data = await response.json();
        setTransactions(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchTransactions();
  }, []);

  useEffect(() => {
    if (transactions.length > 0) {
      console.log('Transactions:', transactions);
    }
  }, [transactions]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <MainWrap>
      <h1>Операции</h1>
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
