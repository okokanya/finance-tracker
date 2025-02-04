import { ComponentProps, FC, PropsWithChildren } from 'react';

import { cn } from '@/utils/cn';

type TextVariants = 'base' | 'sm' | 'xs';

type TextProps = {
  variant?: TextVariants;
  isBold?: boolean;
} & ComponentProps<'p'>;

const Text: FC<PropsWithChildren<TextProps>> = ({
  variant = 'base',
  children,
  className,
  isBold,
  ...props
}) => {
  const classNames = cn(
    'p-0 m-0',
    {
      ['text-base']: variant === 'base',
      ['text-sm']: variant === 'sm',
      ['text-xs']: variant === 'xs',
      ['font-bold']: isBold && variant !== 'xs',
    },
    className
  );

  return (
    <p className={classNames} {...props}>
      {children}
    </p>
  );
};

export default Text;
