import { ReactNode } from 'react';
import bg from '@public/bg.png';

import { cn } from '@/utils/cn';

type Props = {
  children?: ReactNode;
  wrapperClassName?: string;
  className?: string;
};

const MainWrap = ({ children, wrapperClassName, className }: Props) => {
  return (
    <div
      className={cn(
        'flex h-screen w-screen flex-col items-center justify-center bg-cover bg-center',
        wrapperClassName
      )}
      style={{ backgroundImage: `url(${bg.src})` }}
    >
      {children && (
        <div className={cn('flex h-full w-full flex-col items-center justify-center', className)}>
          {children}
        </div>
      )}
    </div>
  );
};

export default MainWrap;
