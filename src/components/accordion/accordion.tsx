import { ComponentProps } from 'react';
import { Disclosure, DisclosureButton, DisclosurePanel, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

import { cn } from '@/utils/cn';

type AccordionProps = ComponentProps<'button'> & {
  title: string;
  defaultOpen?: boolean;
  wrapperClassName?: string;
};

const Accordion: React.FC<AccordionProps> = ({
  title,
  defaultOpen = false,
  children,
  className,
  wrapperClassName,
  ...otherProps
}) => {
  const mainButtonClassNames = cn(
    'inline-flex h-10 w-full items-center justify-between gap-3 bg-white px-3.5 py-2.5',
    'focus:outline-2 focus:-outline-offset-2 focus:outline-blue-500',
    className
  );

  return (
    <Disclosure
      defaultOpen={defaultOpen}
      as="div"
      className={cn('h-auto w-auto', wrapperClassName)}
    >
      {({ open }) => (
        <>
          <DisclosureButton className={mainButtonClassNames} {...otherProps}>
            <span className="font-inter text-sm font-normal text-blue-500">{title}</span>
            <ChevronDownIcon
              className={cn('size-5 text-gray-500 transition-transform duration-200', {
                'rotate-180 transform': open,
              })}
            />
          </DisclosureButton>

          <Transition
            enter="transition duration-100 ease-out"
            enterFrom="transform scale-95 opacity-0"
            enterTo="transform scale-100 opacity-100"
            leave="transition duration-75 ease-out"
            leaveFrom="transform scale-100 opacity-100"
            leaveTo="transform scale-95 opacity-0"
          >
            <DisclosurePanel>{children}</DisclosurePanel>
          </Transition>
        </>
      )}
    </Disclosure>
  );
};

export default Accordion;
