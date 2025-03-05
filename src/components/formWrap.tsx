import { ReactNode } from 'react';

type FullScreenBackgroundProps = {
  children?: ReactNode;
};

const formWrap = ({ children }: FullScreenBackgroundProps) => {
  return (
    <div className="w-full rounded-[12px] bg-transparent px-8 py-8 sm:w-[36.25rem] sm:bg-white">
      {children && (
        <div className="flex h-full w-full flex-col items-center justify-center">{children}</div>
      )}
    </div>
  );
};

export default formWrap;
