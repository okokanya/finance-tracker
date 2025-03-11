import { ReactNode } from 'react';

type FullScreenBackgroundProps = {
  children?: ReactNode;
};

const MainWrap = ({ children }: FullScreenBackgroundProps) => {
  return (
    <div
    // style={{
    //   background:
    //     "radial-gradient(circle at -10% -50%, rgba(16, 185, 129, 1), transparent 50%), " +
    //     "radial-gradient(circle at 70% 10%, rgba(245, 158, 11, 0.4), transparent 20%), " +
    //     "radial-gradient(circle at 80% 40%, rgba(245, 158, 11, 0.5), transparent 20%), " +
    //     "radial-gradient(circle at 90% 60%, rgba(245, 158, 11, 0.4), transparent 20%), " +
    //     "radial-gradient(circle at 10% 90%, rgba(37, 99, 235, 0.3), transparent 60%), " +
    //     "radial-gradient(circle at 80% 80%, rgba(37, 99, 235, 0.3), transparent 20%)",
    //   backgroundBlendMode: "overlay",
    // }}
    className="flex h-screen w-screen flex-col items-center justify-center bg-cover bg-center bg-[url('/bg.png')]" >
      {children && (
        <div className="flex h-full w-full flex-col items-center justify-center">{children}</div>
      )}
    </div>
  );
};

export default MainWrap;
