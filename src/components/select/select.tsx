import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react';
import { CheckIcon, ChevronDownIcon } from '@heroicons/react/24/solid';

import { CARD_SHADOW_CLASS, DISABLED_CLASSES } from '@/components/util/common-classes';
import { cn } from '@/utils/cn';

import { OptionType } from './option-type';

interface SelectProps {
  selected: OptionType;
  options: OptionType[];
  onChangeOption: (selected: OptionType) => void;
  checked?: boolean;
  disabled?: boolean;
  className?: string;
}

const Select: React.FC<SelectProps> = ({
  selected,
  options,
  onChangeOption,
  checked = false,
  disabled = false,
  className,
  ...props
}) => {
  return (
    <Listbox value={selected} onChange={onChangeOption} disabled={disabled} as="div">
      {({ open }) => (
        <>
          <ListboxButton
            className={cn(
              'relative block h-10 w-full rounded border border-gray-300 bg-white py-2.5 pl-3.5 pr-11 text-left',
              'hover:border-blue-600 hover:bg-gray-100',
              'focus:bg-gray-100 focus:outline-none focus:outline-2 focus:-outline-offset-2 focus:outline-blue-500',
              { [DISABLED_CLASSES]: disabled },
              className
            )}
            {...props}
          >
            <span
              title={selected.title}
              className={cn('line-clamp-1 font-inter text-sm font-normal text-gray-800', {
                ['text-gray-300']: disabled,
              })}
            >
              {selected.title}
            </span>
            <ChevronDownIcon
              className={cn(
                'group pointer-events-none absolute right-3.5 top-2.5 size-5 transform fill-gray-500 transition-transform duration-200',
                { ['rotate-180']: open, ['fill-gray-300']: disabled }
              )}
              aria-hidden="true"
            />
          </ListboxButton>
          <ListboxOptions
            anchor="bottom"
            transition
            className={cn(
              'w-[var(--button-width)] rounded border border-gray-300 bg-white [--anchor-gap:1px] focus:outline-none',
              'transition duration-100 ease-in data-[leave]:data-[closed]:opacity-0',
              CARD_SHADOW_CLASS
            )}
          >
            {options.map(option => (
              <ListboxOption
                key={option.value}
                value={option}
                className="group flex min-h-10 cursor-default select-none items-center gap-2 px-3 py-2 data-[focus]:bg-gray-100"
              >
                {checked && (
                  <CheckIcon className="invisible size-4 fill-gray-500 group-data-[selected]:visible" />
                )}
                <span title={option.title} className="font-inter text-sm font-normal text-gray-800">
                  {option.title}
                </span>
              </ListboxOption>
            ))}
          </ListboxOptions>
        </>
      )}
    </Listbox>
  );
};

export default Select;
