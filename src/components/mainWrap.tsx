import { ReactNode } from 'react';

type FullScreenBackgroundProps = {
  children?: ReactNode;
};

const MainWrap = ({ children }: FullScreenBackgroundProps) => {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center bg-[url('/bg.png')] bg-cover bg-center">
      {children && (
        <div className="flex h-full w-full flex-col items-center justify-center">{children}</div>
      )}
    </div>
  );
};

export default MainWrap;
