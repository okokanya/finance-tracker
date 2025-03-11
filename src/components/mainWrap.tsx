import { ReactNode } from 'react';
import bg from '../../public/bg.png';

type FullScreenBackgroundProps = {
  children?: ReactNode;
};

const MainWrap = ({ children }: FullScreenBackgroundProps) => {
  return (
    <div
    className="flex h-screen w-screen flex-col items-center justify-center bg-cover bg-center"
    style={{ backgroundImage: `url(${bg.src})` }} >
      {children && (
        <div className="flex h-full w-full flex-col items-center justify-center">{children}</div>
      )}
    </div>
  );
};

export default MainWrap;
