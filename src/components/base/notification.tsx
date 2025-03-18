import { useState } from 'react';
import { Description, Dialog, DialogPanel, DialogTitle } from '@headlessui/react';

type Props = {
  title: string;
  description?: string;
  open?: boolean;
};

export default function Notification({ title, description, open }: Props) {
  const [isOpen, setIsOpen] = useState(open);

  return (
    <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
      <div className="fixed inset-0 right-4 top-4 flex w-screen items-center justify-center">
        <DialogPanel className="max-w-lg border bg-white p-12">
          <DialogTitle className="font-bold">{title}</DialogTitle>
          <Description>{description}</Description>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
