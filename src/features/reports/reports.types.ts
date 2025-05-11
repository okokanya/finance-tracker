import { Category } from '@/models';

export type ReportMonthData = {
  data: { day: number; value: number }[];
  average: number;
  monthNumber: number;
};

export type ReportCategories = Pick<Category, 'id' | 'name'> & {
  amount: number;
  percentage: number;
  type: 'topup' | 'withdrawal';
};

type ReportAverages = {
  income: number;
  expense: number;
};

export type ReportsData = {
  income: ReportMonthData;
  expense: ReportMonthData;
  categories: ReportCategories[];
  averages: {
    daily: ReportAverages;
    weekly: ReportAverages;
  };
};
