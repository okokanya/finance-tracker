import { PropsWithChildren } from 'react';

type Props = PropsWithChildren & {
  width?: string;
};

const FormWrap = ({ children, width }: Props) => {
  return (
    <div
      className="w-full rounded-[12px] bg-transparent px-8 py-8 sm:w-[24rem] sm:bg-white"
      style={{ width }}
    >
      {children && (
        <div className="flex h-full w-full flex-col items-center justify-center">{children}</div>
      )}
    </div>
  );
};

export default FormWrap;
