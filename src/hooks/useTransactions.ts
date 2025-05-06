import { useState, useEffect, useCallback } from 'react';

interface Transaction {
  id: string;
  date: string;
  accountName: string | null;
  categoryName: string | null;
  comment: string | null;
  amount: number;
  type: string;
}

interface OptionType {
  value: string;
  title: string;
}

interface MonthYearResponse {
  data: string[];
}

const API_ENDPOINTS = {
  TRANSACTIONS_LIST: '/api/transactions/transactions-list',
  TRANSACTIONS_TABLE: '/api/transactions/transactions-table',
};

const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [monthYearOptions, setMonthYearOptions] = useState<OptionType[]>([]);
  const [selectedMonthYear, setSelectedMonthYear] = useState<OptionType | null>(null);

  const fetchMonthYearList = useCallback(async () => {
    try {
      const res = await fetch(API_ENDPOINTS.TRANSACTIONS_LIST);
      const { data }: MonthYearResponse = await res.json();
      const options = data.map((ym) => ({ value: ym, title: ym }));
      setMonthYearOptions(options);
      if (data.length > 0) setSelectedMonthYear({ value: data[0], title: data[0] });
    } catch (error) {
      setError('Ошибка загрузки списка периодов. Попробуйте позже.');
      console.error('Error loading months:', error);
    }
  }, []);

  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const url = selectedMonthYear
        ? `${API_ENDPOINTS.TRANSACTIONS_TABLE}?monthYear=${selectedMonthYear.value}`
        : API_ENDPOINTS.TRANSACTIONS_TABLE;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch transactions');
      const data: Transaction[] = await res.json();
      setTransactions(data);
    } catch (error) {
      setError('Ошибка загрузки транзакций. Попробуйте позже.');
      console.error('Error loading transactions:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedMonthYear]);

  useEffect(() => {
    fetchMonthYearList();
  }, [fetchMonthYearList]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  return {
    transactions,
    setTransactions,
    loading,
    error,
    monthYearOptions,
    selectedMonthYear,
    setSelectedMonthYear,
    fetchTransactions,
  };
};

export default useTransactions;
