import { ComponentProps } from 'react';
import { Button as HeadlessButton } from '@headlessui/react';

import { cn } from '@/utils/cn';

type ButtonVariant = 'primary' | 'secondary' | 'error' | 'warning';

export type ButtonProps = ComponentProps<'button'> & {
  variant?: ButtonVariant;
};

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  children,
  className,
  ...otherProps
}) => {
  const secondaryBaseClass =
    'border-2 border-solid border-gray-300 bg-white hover:bg-white disabled:bg-white';
  const classNames = cn(
    'button font-inter font-bold',
    {
      ['text-grey-100 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 active:text-white']:
        variant === 'primary',
      [`${secondaryBaseClass} text-gray-800 hover:text-blue-600 disabled:text-gray-400`]:
        variant === 'secondary',
      [`${secondaryBaseClass} text-red-500 hover:text-red-700 disabled:text-red-100`]:
        variant === 'error',
      [`${secondaryBaseClass} text-yellow-500 hover:text-yellow-600 disabled:text-yellow-100`]:
        variant === 'warning',
    },
    className
  );

  return (
    <HeadlessButton className={classNames} {...otherProps}>
      {children}
    </HeadlessButton>
  );
};

export default Button;
