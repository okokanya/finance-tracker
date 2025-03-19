import { PropsWithChildren } from 'react';

import { cn } from '@/utils/cn';

type TopBottomBorderProps = PropsWithChildren & {
  className?: string;
};

const TopBottomBorder: React.FC<TopBottomBorderProps> = ({ children, className }) => (
  <div className={cn('border-b border-t border-gray-300', className)}>{children}</div>
);

export default TopBottomBorder;
