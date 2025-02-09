import { Button, Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';

import Title from '@/components/title/title';
import { cn } from '@/utils/cn';

type ModalProps = {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

// TODO: добавить проверку на мобильный лейаут и менять верстку
const Modal: React.FC<ModalProps> = ({ title, isOpen, onClose, children }) => {
  return (
    <Dialog open={isOpen} as="div" className="relative focus:outline-none" onClose={onClose}>
      <DialogBackdrop className="fixed inset-0 bg-gray-800/30 backdrop-blur-sm" />
      <div className="fixed inset-0 w-screen overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <DialogPanel
            transition
            className={cn(
              'data-[closed]:transform-[scale(95%)] w-[580px] rounded-xl',
              'bg-white px-5 py-4 duration-300 ease-out data-[closed]:opacity-0',
              'shadow-[0px_8px_18px_0px_rgba(229,231,235,1.00)]'
            )}
          >
            <div className="flex w-full items-start justify-between self-stretch">
              <Title>{title}</Title>
              <Button
                className={cn(
                  'flex size-10 flex-col items-center justify-center text-gray-500',
                  'hover:bg-gray-100 hover:text-gray-800 focus:bg-gray-100 focus:outline-none',
                  'focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-blue-500'
                )}
                onClick={onClose}
              >
                <XMarkIcon className="size-7" />
              </Button>
            </div>
            {children}
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};

export default Modal;
