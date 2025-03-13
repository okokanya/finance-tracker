import { PropsWithChildren } from 'react';

type Props = PropsWithChildren & {
  widthSm?: string;  // Ширина для экранов sm и меньше
  widthLg?: string;  // Ширина для экранов больше sm
};

const FormWrap = ({ children, widthSm = '100%', widthLg = '24rem' }: Props) => {
  return (
    <div
      className="rounded-[12px] bg-transparent px-8 py-8 sm:bg-white w-full"
      style={{
        width: widthSm,  // для экранов sm и меньше
        maxWidth: widthLg, // для экранов больше sm
      }}
    >
      {children && (
        <div className="flex h-full w-full flex-col items-center justify-center">
          {children}
        </div>
      )}
    </div>
  );
};

export default FormWrap;
