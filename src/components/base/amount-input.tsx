import { useState } from 'react';

import Input, { InputProps } from '@/components/base/input';
import { useFormatHelpers } from '@/utils/format-amount';

type Props = InputProps & {
  initAmount?: number;
  onAmountChanged: (value: number) => void;
};

export default function AmountInput({
  initAmount,
  onAmountChanged,
  currencySumbol = '₽',
  ...props
}: Props) {
  const { format, sanitize, parseToNumber } = useFormatHelpers({});
  const [amount, setAmount] = useState(initAmount ? initAmount : NaN);
  const [input, setInput] = useState(initAmount === undefined ? '' : format(initAmount));

  const onChange = (value: string): void => {
    const sanitized = sanitize(value);
    const parsedAmount = parseToNumber(sanitized);

    setAmount(parsedAmount);
    onAmountChanged(parsedAmount);
    setInput(sanitized);
  };

  return (
    <Input
      {...props}
      currencySumbol={currencySumbol}
      value={input}
      maxLength={15}
      onFocus={() => setInput(sanitize(input))}
      onBlur={() => setInput(format(amount))}
      onChange={e => onChange(e.target.value)}
    />
  );
}
