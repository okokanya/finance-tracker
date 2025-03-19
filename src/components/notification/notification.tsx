import { Fragment, useEffect } from 'react';
import { Transition } from '@headlessui/react';

import { useNotificationStore } from './notification.store';

export const Notification = () => {
  const { isShowing, message, hide } = useNotificationStore();

  useEffect(() => {
    if (isShowing) {
      const timer = setTimeout(hide, 5000);
      return () => clearTimeout(timer);
    }
  }, [isShowing, hide]);

  return (
    <div className="fixed right-4 top-4 z-50 w-full max-w-sm">
      <Transition
        show={isShowing}
        as={Fragment}
        enter="transform transition ease-out duration-300"
        enterFrom="opacity-0 translate-y-2"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in duration-200"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="relative rounded-lg bg-white p-4 shadow-lg ring-1 ring-black ring-opacity-5">
          <div className="flex items-start">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Новое уведомление!</p>
              <p className="mt-1 text-sm text-gray-500">{message}</p>
            </div>
            <button
              onClick={hide}
              className="-mr-2 -mt-0.5 ml-4 p-2 text-gray-400 hover:text-gray-500 focus:outline-none"
            >
              ✕
            </button>
          </div>
        </div>
      </Transition>
    </div>
  );
};
