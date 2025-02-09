import { ComponentProps, useRef, useState } from 'react';
import { Button as HeadlessButton, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/solid';

import { CARD_SHADOW_CLASS, DISABLED_CLASSES } from '@/components/util/common-classes';
import { cn } from '@/utils/cn';

import { useOutsideClickClose } from './hooks/useOutsideClickClose';
import { OptionType } from './option-type';

type SelectProps = ComponentProps<'button'> & {
  selected?: string;
  options: OptionType[];
  onChangeOption?: (selected: OptionType) => void;
  onClose?: () => void;
  wrapperClassName?: string;
  optionsWrapperClassName?: string;
};

const Select: React.FC<SelectProps> = ({
  options,
  selected,
  onChangeOption,
  onClose,
  disabled,
  className,
  wrapperClassName,
  optionsWrapperClassName,
  ...otherProps
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedValue, setSelectedValue] = useState(selected ?? options[0].title);
  const rootRef = useRef<HTMLDivElement | null>(null);

  useOutsideClickClose({
    isOpen,
    rootRef,
    onClose,
    onChange: setIsOpen,
  });

  const handleSelect = (option: OptionType) => {
    setSelectedValue(option.title);
    setIsOpen(false);
    onChangeOption?.(option);
  };

  const focusClasses =
    'focus:bg-gray-100 focus:outline-none focus:outline-2 focus:-outline-offset-2 focus:outline-blue-500';
  const mainButtonClassNames = cn(
    'inline-flex h-10 w-full items-center justify-between gap-3',
    'rounded border border-gray-300 bg-white px-3.5 py-2.5',
    `${focusClasses} hover:border-blue-600 hover:bg-gray-100`,
    {
      [DISABLED_CLASSES]: disabled,
    },
    className
  );

  return (
    <div ref={rootRef} className={cn('relative inline-block h-auto w-auto', wrapperClassName)}>
      <HeadlessButton
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
        className={mainButtonClassNames}
        {...otherProps}
      >
        <span
          className={cn('font-inter text-sm font-normal text-gray-800', {
            ['text-gray-300']: disabled,
          })}
        >
          {selectedValue}
        </span>
        <ChevronDownIcon
          className={cn(`size-5 transform text-gray-500 transition-transform duration-200`, {
            ['rotate-180']: isOpen,
            ['text-gray-300']: disabled,
          })}
        />
      </HeadlessButton>

      <Transition
        show={isOpen}
        enter="transition duration-100 ease-out"
        enterFrom="transform scale-95 opacity-0"
        enterTo="transform scale-100 opacity-100"
        leave="transition duration-75 ease-out"
        leaveFrom="transform scale-100 opacity-100"
        leaveTo="transform scale-95 opacity-0"
      >
        <div
          className={cn(
            'absolute mt-[1px] flex h-auto w-full flex-col items-start justify-start gap-0.5 overflow-auto',
            `rounded border border-gray-300 bg-white ${CARD_SHADOW_CLASS}`,
            optionsWrapperClassName
          )}
        >
          {options.map((option, index) => (
            <HeadlessButton
              key={index}
              onClick={() => handleSelect(option)}
              className={`${focusClasses} inline-flex h-9 w-full items-center justify-start px-4 py-2 hover:bg-gray-100`}
            >
              <span className="font-inter text-sm font-normal text-gray-800">{option.title}</span>
            </HeadlessButton>
          ))}
        </div>
      </Transition>
    </div>
  );
};

export default Select;
