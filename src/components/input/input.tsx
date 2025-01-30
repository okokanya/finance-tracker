import { Input as HeadlessInput, InputProps as HeadlessInputProps } from '@headlessui/react';

import { cn } from '@/utils/cn';

export type InputProps = HeadlessInputProps & {
  errorText?: string;
  wrapperClassName?: string;
};

const Input: React.FC<InputProps> = ({
  className,
  errorText,
  disabled,
  wrapperClassName,
  ...props
}) => {
  const inputClasses: InputProps['className'] = cn(
    'h-10 w-auto rounded-[4px] border border-gray-300 bg-white px-[14px] hover:border-gray-400 hover:bg-gray-100 focus:border-blue-500 focus:bg-gray-100 font-normal text-base',
    {
      ['bg-gray-200 cursor-not-allowed hover:bg-gray-200 text-gray-400']: disabled,
      ['border-red-500 mb-1']: Boolean(errorText),
    },
    className
  );

  return (
    <div className={cn('block h-auto w-auto', wrapperClassName)}>
      <HeadlessInput className={inputClasses} disabled={disabled} {...props} />
      {errorText ? <p className="m-0 text-xs font-normal text-red-500">{errorText}</p> : null}
    </div>
  );
};

export default Input;
