import { ReactNode } from "react";

type FullScreenBackgroundProps = {
  children?: ReactNode;
};

const FsBg = ({ children }: FullScreenBackgroundProps) => {
  return (
    <div className="w-screen h-screen bg-[url('/bg.png')] bg-cover bg-center items-center justify-center flex flex-col">
      {children && <div className="w-full h-full flex items-center justify-center flex-col">{children}</div>}
    </div>
  );
};

export default FsBg;
