import { useEffect, useState } from 'react';
import { DateTime } from 'luxon';
import { useFormContext } from 'react-hook-form';

import { cn } from '@/utils/cn';

import { OptionType } from './select/option-type';
import Select from './select/select';

const getDaysInMonth = (year: number | string, monthName: string) => {
  const y = typeof year === 'number' ? year : Number(year);
  const monthNumber = DateTime.fromFormat(monthName, 'LLLL', { locale: 'ru' }).month;
  return DateTime.local(y, monthNumber).daysInMonth || 31;
};

type Props = {
  currentDate?: DateTime;
};

export default function DatePicker({ currentDate }: Props) {
  const {
    register,
    setValue,
    formState: { errors },
  } = useFormContext();

  const now = currentDate || DateTime.now().setLocale('ru');
  const defaultMonth = now.toFormat('LLLL');
  const defaultMonthValue = now.month;
  const defaultYear = now.year;
  const defaultDay = now.day;

  const [day, setDay] = useState<OptionType>({
    title: String(defaultDay),
    value: String(defaultDay),
  });
  const [month, setMonth] = useState({ title: defaultMonth, value: String(defaultMonthValue) });
  const [year, setYear] = useState({ title: String(defaultYear), value: String(defaultYear) });

  useEffect(() => {
    if (currentDate) {
      setDay({ title: String(currentDate.day), value: String(currentDate.day) });
      setMonth({ title: String(currentDate.toFormat('LLLL')), value: String(currentDate.month) });
      setYear({ title: String(currentDate.year), value: String(currentDate.year) });
      setValue('day', currentDate.day);
      setValue('month', currentDate.month);
      setValue('year', currentDate.year);
    }
  }, [currentDate, setValue]);

  const days: OptionType[] = Array.from(
    { length: getDaysInMonth(year.value, month.value) },
    (_, i) => ({
      value: String(i + 1),
      title: String(i + 1),
    })
  );

  const months: OptionType[] = Array.from({ length: 12 }, (_, i) => {
    return {
      value: String(i + 1),
      title: DateTime.fromObject({ month: i + 1 })
        .setLocale('ru')
        .toFormat('LLLL'),
    };
  });

  const years: OptionType[] = Array.from({ length: 10 }, (_, i) => {
    const year = DateTime.now().year + i;
    return { value: String(year), title: String(year) };
  });

  const handleChange = (type: 'day' | 'month' | 'year', value: OptionType) => {
    if (type === 'day') {
      setDay(value);
    }
    if (type === 'month') {
      setMonth(value);
    }
    if (type === 'year') {
      setYear(value);
    }
    setValue(type, Number(value.value));
  };

  return (
    <div className="flex w-full flex-row gap-1">
      <Select
        label="Число"
        options={days}
        selected={day}
        onChangeOption={selected => handleChange('day', selected)}
        wrapperClassName={cn('w-20')}
        {...register('day', { value: Number(day.value) })}
        errorText={errors?.day?.message as string}
      />

      <Select
        label="Месяц"
        options={months}
        selected={month}
        onChangeOption={selected => handleChange('month', selected)}
        {...register('month', { value: Number(month.value) })}
        wrapperClassName={cn('w-full')}
        errorText={errors?.month?.message as string}
      />

      <Select
        label="Год"
        options={years}
        selected={year}
        onChangeOption={selected => handleChange('year', selected)}
        {...register('year', { value: Number(year.value) })}
        wrapperClassName={cn('w-21')}
        errorText={errors?.year?.message as string}
      />
    </div>
  );
}
