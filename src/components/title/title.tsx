import { ComponentProps, FC, PropsWithChildren } from 'react';
import { Roboto } from 'next/font/google';

import { cn } from '@/utils/cn';

const roboto = Roboto({
  subsets: ['cyrillic', 'latin'],
  weight: ['400', '700'],
});

type TitleVariants = 'h1' | 'h2' | 'h3';

type TitleProps = {
  variant?: TitleVariants;
} & ComponentProps<'h2'>;

const Title: FC<PropsWithChildren<TitleProps>> = ({
  variant = 'h2',
  children,
  className,
  ...props
}) => {
  const Component = variant; // TODO: добавить проверку на мобильный лейаут и менять динамически на h3

  const classNames = cn(
    roboto.className,
    'font-bold',
    {
      ['text-2xl']: variant === 'h2',
      ['text-3xl']: variant === 'h1',
      ['text-xl']: variant === 'h3',
    },
    className
  );

  return (
    <Component className={classNames} {...props}>
      {children}
    </Component>
  );
};

export default Title;
