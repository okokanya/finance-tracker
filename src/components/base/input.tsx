import {
  Field,
  Input as HeadlessInput,
  InputProps as HeadlessInputProps,
  Label,
} from '@headlessui/react';

import { cn } from '@/utils/cn';

export type InputProps = HeadlessInputProps & {
  label?: string;
  errorText?: string;
  wrapperClassName?: string;
  currencySumbol?: string;
};

const Input: React.FC<InputProps> = ({
  label,
  className,
  errorText,
  disabled,
  wrapperClassName,
  currencySumbol,
  ...props
}) => {
  const inputClasses: InputProps['className'] = cn(
    'h-10 w-auto rounded-[4px] border border-gray-300 bg-white px-[14px] hover:border-gray-400 hover:bg-gray-100 focus:border-blue-500 focus:bg-gray-100 font-normal text-base',
    {
      ['bg-gray-200 cursor-not-allowed hover:bg-gray-200 text-gray-400']: disabled,
      ['border-red-500 mb-1']: Boolean(errorText),
    },
    currencySumbol && 'pr-8',
    className
  );

  return (
    <div className={cn('block h-auto w-auto', wrapperClassName)}>
      <Field className="flex flex-col gap-0.5">
        {label && <Label className="text-xs text-gray-500">{label}</Label>}
        <div className="relative">
          <HeadlessInput className={inputClasses} disabled={disabled} {...props} />
          {currencySumbol && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
              {currencySumbol}
            </span>
          )}
        </div>
      </Field>
      {errorText ? <p className="text-xs font-normal text-red-500">{errorText}</p> : null}
    </div>
  );
};

export default Input;
