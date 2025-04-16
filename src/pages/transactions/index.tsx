import { useEffect, useState } from 'react';
import Spinner from '@/components/base/spinner';
import Title from '@/components/base/title';
import Select from '@/components/base/select/select';
import { getAmountStyle } from '@/components/util/amount-style';

type Transaction = {
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

const formatNumber = (num: number) => {
  return num.toLocaleString('ru-RU');
};

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [monthYearOptions, setMonthYearOptions] = useState<OptionType[]>([]);
  const [selectedMonthYear, setSelectedMonthYear] = useState<OptionType | null>(null);

  // Загрузка списка месяцев/годов
  useEffect(() => {
    const fetchMonthYearList = async () => {
      try {
        const res = await fetch('/api/transactions/transactions-list');
        const data = await res.json();
        const monthYearStrings = data.data as string[];

        // Преобразуем в формат для Select
        const options = monthYearStrings.map(ym => ({
          value: ym,
          title: ym
        }));

        setMonthYearOptions(options);

        // Устанавливаем первый элемент как выбранный по умолчанию
        if (options.length > 0) {
          setSelectedMonthYear(options[0]);
        }
      } catch (error) {
        console.error('Ошибка при загрузке месяцев и годов:', error);
      }
    };

    fetchMonthYearList();
  }, []);

  // Загрузка транзакций
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        // Если выбран месяц-год, добавляем в URL параметры
        const url = selectedMonthYear
          ? `/api/transactions/transactions-table?monthYear=${selectedMonthYear.value}`
          : '/api/transactions/transactions-table';

        const res = await fetch(url);
        const data = await res.json();
        setTransactions(data);
        setLoading(false);
      } catch (error) {
        console.error('Ошибка при загрузке:', error);
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [selectedMonthYear]); // Зависимость от выбранного месяца-года

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  const handleMonthYearChange = (option: OptionType) => {
    setSelectedMonthYear(option);
    setLoading(true); // Показываем спиннер при смене периода
  };

  return (
    <main className="w-full p-6">
      <Title className="justify-self-start" variant="h1">
        Операции
      </Title>

      {monthYearOptions.length > 0 && selectedMonthYear && (
        <Select
          label="Период"
          options={monthYearOptions}
          selected={selectedMonthYear}
          onChangeOption={handleMonthYearChange}
          className="mb-4 w-40"
        />
      )}

      <div>
        {transactions.length === 0 ? (
          <div className="text-center text-gray-500 mt-8 text-lg">
            В выбранном периоде нет операций
          </div>
        ) : (
          transactions.map((tx, index) => {
            let amountStyle = '';
            if (tx.type === 'transfer' || tx.type === 'withdrawal') {
              amountStyle = 'text-red-500 negative-number';
            } else if (tx.type === 'topup') {
              amountStyle = 'text-emerald-500';
            } else {
              amountStyle = getAmountStyle(tx.amount);
            }

            const formattedAmount = formatNumber(tx.amount);

            return (
              <div
                key={index}
                className="flex flex-wrap mb-2 rounded-lg bg-white hover:bg-gray-100 hover:shadow-lg transition-all duration-200"
              >
                <div className="flex p-2 items-center w-[10%]">
                  <div>{tx.date}</div>
                </div>
                <div className="flex p-2 items-center w-[15%]">
                  <div>{tx.accountName ?? '—'}</div>
                </div>
                <div className="flex p-2 items-center w-[25%]">
                  <div>{tx.categoryName ?? '—'}</div>
                </div>
                <div className="flex p-2 items-center w-[37%]">
                  <div>{tx.comment ?? '—'}</div>
                </div>
                <div className="flex p-2 items-center w-[10%] justify-end">
                  <div className={`${amountStyle}`}>{formattedAmount}</div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </main>
  );
}
