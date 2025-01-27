import { ComponentProps, ReactNode } from 'react';
import { Button as HeadlessButton } from '@headlessui/react';

import { cn } from '@/utils/cn';

type ButtonVariant = 'primary' | 'secondary' | 'icon';

export type ButtonProps = ComponentProps<'button'> & {
  variant?: ButtonVariant;
  icon?: ReactNode;
};

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  children,
  icon,
  className,
  ...otherProps
}) => {
  const classNames = cn(
    'button ',
    {
      ['bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-grey-100 active:text-white']:
        variant === 'primary',
      ['bg-white text-gray-800 border-2 border-solid border-gray-300 hover:bg-white  hover:text-blue-600 disabled:text-gray-400 disabled:bg-white']:
        variant === 'secondary',
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
