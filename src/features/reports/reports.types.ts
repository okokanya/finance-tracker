import { Category } from '@/models';

export type ReportMonthData = {
  data: { day: number; value: number }[];
  average: number;
  monthNumber: number;
};

export type ReportCategories = Pick<Category, 'id' | 'name' | 'type'> & {
  amount: number;
  percentage: number;
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
