import MonthChart from '@/components/base/month-chart';
import Title from '@/components/base/title';
import { REPORTS_MONTH_CURRENT } from '@/features/reports/reports.constants';
import useReports from '@/features/reports/reports.queries';
import { texts } from '@/features/reports/reports.texts';

export default function Reports() {
  const { data, isPending, error } = useReports({ month: REPORTS_MONTH_CURRENT });

  if (isPending) return <span>Загрузка...</span>;

  if (error) return <span>Ошибка: {error.message}</span>;

  return (
    <section className="mt-10 w-full">
      <div className="mb-6 flex gap-2">
        <Title className="justify-self-start" variant="h1">
          {texts.title}
        </Title>
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
