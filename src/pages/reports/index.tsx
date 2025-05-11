import MonthChart from '@/components/base/month-chart';
import { OptionType } from '@/components/base/select/option-type';
import Select from '@/components/base/select/select';
import Title from '@/components/base/title';
import useReports, { useReportMonthList } from '@/features/reports/reports.queries';
import { texts } from '@/features/reports/reports.texts';
import { useEffect, useState } from 'react';

  const formatCurrentMonth = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
  };

export default function Reports() {
  const [selectedMonth, setSelectedMonth] = useState<OptionType | null>(null);

  const { data: monthList,  } = useReportMonthList();

  const { data, isPending, error } = useReports({
    monthYear: selectedMonth?.value || formatCurrentMonth()
  });

  useEffect(() => {
    if (monthList && monthList.length > 0) {
      setSelectedMonth(monthList[0]);
    }
  }, [monthList])

  if (isPending) return <span>Загрузка...</span>;

  if (error) return <span>Ошибка: {error.message}</span>;

  return (
    <section className="mt-10 w-full">
      <div className="mb-6 flex gap-2 justify-between">
        <Title className="justify-self-start" variant="h1">
          {texts.title}
        </Title>
        {monthList && selectedMonth && (
          <Select
            label="Период"
            options={monthList}
            selected={selectedMonth }
            onChangeOption={setSelectedMonth}
            className="mb-4 w-40"
          />
        )}

      </div>
      <div className="flex w-full flex-row gap-5">
        <MonthChart
          data={data.income.data}
          chartType="income"
          averageValue={data.income.average}
          monthNumber={data.income.monthNumber}
        />
        <MonthChart
          data={data.expense.data}
          chartType="expense"
          averageValue={data.expense.average}
          monthNumber={data.expense.monthNumber}
        />
      </div>
    </section>
  );
}

export async function getServerSideProps() {
  return {
    props: {
      title: 'Отчеты',
    },
  };
}
