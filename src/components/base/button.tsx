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
  const classNames = cn(
    'uikit-button',
    {
      ['uikit-button-primary']: variant === 'primary',
      [`uikit-button-secondary`]: variant === 'secondary',
      [`uikit-button-error`]: variant === 'error',
      [`uikit-button-warning`]: variant === 'warning',
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
