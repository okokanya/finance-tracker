import { ReactNode } from "react";

type FullScreenBackgroundProps = {
  children?: ReactNode;
};

const formWrap = ({ children }: FullScreenBackgroundProps) => {
  return (
    <div className="bg-transparent sm:bg-white  py-8 px-8 rounded-[12px] w-full sm:w-[36.25rem]">
      {children && <div className="w-full h-full flex items-center justify-center flex-col">{children}</div>}
    </div>
  );
};

export default formWrap;
