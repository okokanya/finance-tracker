import { useEffect, useState } from 'react';

import MonthChart from '@/components/base/month-chart';
import { OptionType } from '@/components/base/select/option-type';
import Select from '@/components/base/select/select';
import Title from '@/components/base/title';
import ReportAverages from '@/components/categories/report-averages';
import ReportCategory from '@/components/categories/report-category';
import useReports, { useReportMonthList } from '@/features/reports/reports.queries';
import { texts } from '@/features/reports/reports.texts';

const formatCurrentMonth = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
};

export default function Reports() {
  const [selectedMonth, setSelectedMonth] = useState<OptionType | null>(null);

  const { data: monthList } = useReportMonthList();

  const { data, isPending, error } = useReports({
    monthYear: selectedMonth?.value || formatCurrentMonth(),
  });

  useEffect(() => {
    if (monthList && monthList.length > 0) {
      setSelectedMonth(monthList[0]);
    }
  }, [monthList]);

  if (isPending) return <span>Загрузка...</span>;

  if (error) return <span>Ошибка: {error.message}</span>;

  return (
    <section className="mb-10 mt-10 w-full">
      <div className="mb-6 flex justify-between gap-2">
        <Title className="justify-self-start" variant="h1">
          {texts.title}
        </Title>
        {monthList && selectedMonth && (
          <Select
            label="Период"
            options={monthList}
            selected={selectedMonth}
            onChangeOption={setSelectedMonth}
            className="mb-4 w-40"
          />
        )}
      </div>
      <div className="mb-6 flex w-full flex-col gap-3 md:flex-row md:gap-5">
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
      <div className="mb-6 flex w-full flex-col gap-3 md:flex-row md:gap-5">
        <ReportAverages
          type="topup"
          title="Средний доход"
          values={[
            { label: 'за день', value: data.averages.daily.income },
            { label: 'за неделю', value: data.averages.weekly.income },
          ]}
        />
        <ReportAverages
          type="withdrawal"
          title="Средний расход"
          values={[
            { label: 'за день', value: data.averages.daily.expense },
            { label: 'за неделю', value: data.averages.weekly.expense },
          ]}
        />
      </div>
      <div className="flex w-full flex-col gap-3 md:flex-row md:gap-5">
        {data.categories.map(category => (
          <ReportCategory
            key={category.id}
            category={category.name}
            value={category.amount}
            percent={category.percentage}
            type={category.type}
          />
        ))}
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
