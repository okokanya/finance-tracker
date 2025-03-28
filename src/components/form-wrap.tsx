import { PropsWithChildren } from 'react';

type Props = PropsWithChildren & {
  smWidth?: 'sm:w-[24rem]' | 'sm:w-[32rem]' | 'sm:w-[36rem]' | `sm:w-[${string}]`;
};

const FormWrap = ({ children, smWidth = 'sm:w-[24rem]' }: Props) => {
  return (
    <div className={`w-full rounded-[12px] bg-transparent px-8 py-8 sm:bg-white ${smWidth}`}>
      {children && (
        <div className="flex h-full w-full flex-col items-center justify-center">{children}</div>
      )}
    </div>
  );
};

export default FormWrap;
