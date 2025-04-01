import { useEffect, useRef } from 'react';
import { Button, Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react';
import { ArrowLongLeftIcon, XMarkIcon } from '@heroicons/react/24/outline';

import Title from '@/components/base/title';
import { cn } from '@/utils/cn';

export type ModalProps = {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

const Modal: React.FC<ModalProps> = ({ title, isOpen, onClose, children }) => {
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (headerRef.current) {
      const headerHeight = headerRef.current.offsetHeight;
      document.documentElement.style.setProperty('--modal-header-height', `${headerHeight}px`);
    }
  }, [title]);

  return (
    <Dialog open={isOpen} as="div" className="relative focus:outline-none" onClose={onClose}>
      <DialogBackdrop className="fixed inset-0 bg-gray-800/30 backdrop-blur-sm" />
      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-0 md:p-4">
          <DialogPanel
            transition
            className={cn(
              'uikit-modal-shadow data-[closed]:transform-[scale(95%)] min-h-dvh w-full md:min-h-fit md:w-[580px] md:rounded-xl',
              'bg-gray-100 px-5 py-5 duration-300 ease-out data-[closed]:opacity-0 md:bg-white md:py-4'
            )}
          >
            <div
              ref={headerRef}
              className="flex w-full flex-row items-start justify-start gap-2 self-stretch md:flex-row-reverse md:justify-between"
            >
              <Button
                className={cn(
                  'flex h-10 w-7 flex-col items-center justify-center text-gray-500 md:h-10 md:w-10',
                  'hover:bg-gray-100 hover:text-gray-800 focus:bg-gray-100 focus:outline-none',
                  'focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-blue-500'
                )}
                onClick={onClose}
              >
                <ArrowLongLeftIcon className="uikit-show-mobile size-7 self-start" />
                <XMarkIcon className="uikit-show-desktop size-7" />
              </Button>
              <Title>{title}</Title>
            </div>
            {children}
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};

export default Modal;
