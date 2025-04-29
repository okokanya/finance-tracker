const monthNames = {
  nominative: [
    'январь',
    'февраль',
    'март',
    'апрель',
    'май',
    'июнь',
    'июль',
    'август',
    'сентябрь',
    'октябрь',
    'ноябрь',
    'декабрь',
  ],
  genitive: [
    'января',
    'февраля',
    'марта',
    'апреля',
    'мая',
    'июня',
    'июля',
    'августа',
    'сентября',
    'октября',
    'ноября',
    'декабря',
  ],
} as const;

type CaseForm = keyof typeof monthNames;

export function getMonthName(monthNumber: number, caseForm: CaseForm = 'genitive'): string {
  return monthNames[caseForm][monthNumber - 1];
}
