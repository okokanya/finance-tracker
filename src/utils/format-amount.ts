import { ACCOUNT_LIMITS } from '@/features/accounts/accounts.constants';

const NON_BREAKING_SPACE = '\u00A0';

type FormatterParam = {
  currency?: string;
  locale?: string;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
};

type DisplayParam = {
  amount: number;
  isAddPlusSign?: boolean;
  maxNumberPartLength?: number;
};

export const useDisplayAmountHelper = ({ currency = 'RUB', ...otherParam }: FormatterParam) => {
  const { formatter, decimalSeparator } = useCreateFormatterHelper({
    currency: currency,
    ...otherParam,
  });

  const getDisplayAmount = ({
    amount,
    isAddPlusSign = false,
    maxNumberPartLength,
  }: DisplayParam): string => {
    if (isNaN(amount)) return '';

    const isExceeded =
      amount >= ACCOUNT_LIMITS.EXCEEDED_TOTAL_BALANCE ||
      amount <= ACCOUNT_LIMITS.EXCEEDED_NEGATIVE_TOTAL_BALANCE;
    const value = isExceeded ? ACCOUNT_LIMITS.MAX_TOTAL_BALANCE : amount;
    const formattedValue = formatter.format(Math.abs(value));
    const sign =
      amount < 0 ? `—${NON_BREAKING_SPACE}` : isAddPlusSign ? `+${NON_BREAKING_SPACE}` : '';
    const displayAmount = `${sign}${formattedValue}`;
    const exceededSing = '...';

    if (maxNumberPartLength && displayAmount.length - 2 >= maxNumberPartLength) {
      const currencyPartIndex = displayAmount.length - 2;
      let numberPart = displayAmount.slice(0, maxNumberPartLength);

      if (numberPart.endsWith(NON_BREAKING_SPACE) || numberPart.endsWith(decimalSeparator)) {
        numberPart = numberPart.slice(0, numberPart.length - 1);
      }

      return numberPart + exceededSing + displayAmount.slice(currencyPartIndex);
    }

    if (isExceeded) {
      const index = displayAmount.length - 2;
      return displayAmount.slice(0, index) + exceededSing + displayAmount.slice(index);
    }

    return displayAmount;
  };

  return { getDisplayAmount };
};

const useCreateFormatterHelper = ({
  currency,
  locale = 'ru-RU',
  minimumFractionDigits = 0,
  maximumFractionDigits = 2,
}: FormatterParam) => {
  const formatter = new Intl.NumberFormat(locale, {
    style: currency ? 'currency' : 'decimal',
    currency: currency,
    minimumFractionDigits: minimumFractionDigits,
    maximumFractionDigits: maximumFractionDigits,
  });

  const thousandSeparator =
    formatter.formatToParts(11111111).find(({ type }) => type === 'group')?.value ?? '';
  const decimalSeparator =
    formatter.formatToParts(1.1).find(({ type }) => type === 'decimal')?.value ?? '';
  const literalSeparator =
    formatter.formatToParts(1.1).find(({ type }) => type === 'literal')?.value ?? '';

  return {
    formatter,
    thousandSeparator,
    decimalSeparator,
    literalSeparator,
  };
};

export const useFormatHelpers = ({ ...otherParam }: FormatterParam) => {
  const { formatter, thousandSeparator, decimalSeparator, literalSeparator } =
    useCreateFormatterHelper({ ...otherParam });

  const format = (value: number): string => {
    if (isNaN(value)) return '';
    return formatter.format(value);
  };

  const sanitize = (value: string): string => {
    if (!value) return '';

    const maxIntegerDigits = 12;
    const maxFractionDigits = 2;

    let cleaned = value.replace(new RegExp(`\\${thousandSeparator}`, 'g'), '');
    const decimalIndex = cleaned.indexOf(decimalSeparator);

    if (decimalIndex !== -1) {
      const integerPart = cleaned.substring(0, decimalIndex);
      const fractionPart = cleaned.substring(decimalIndex + 1);

      const sanitizedInteger = integerPart.replace(/[^0-9]/g, '').substring(0, maxIntegerDigits);
      const sanitizedFraction = fractionPart.replace(/[^0-9]/g, '').substring(0, maxFractionDigits);

      cleaned = `${sanitizedInteger}${decimalSeparator}${sanitizedFraction}`;
    } else {
      cleaned = cleaned.replace(/[^0-9]/g, '').substring(0, maxIntegerDigits);
    }

    return cleaned;
  };

  const parseToNumber = (value: string): number => {
    if (!value) return NaN;

    const numericString = value
      .replace(literalSeparator, '')
      .replace(new RegExp(`\\${thousandSeparator}`, 'g'), '')
      .replace(new RegExp(`\\${decimalSeparator}`), '.');

    const numberValue = parseFloat(numericString);

    if (isNaN(numberValue)) return 0;

    return Math.abs(numberValue);
  };

  return {
    format,
    sanitize,
    parseToNumber,
  };
};
