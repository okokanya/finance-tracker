import {
  Field,
  Label,
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from '@headlessui/react';
import { CheckIcon, ChevronDownIcon } from '@heroicons/react/24/solid';

import { cn } from '@/utils/cn';

import { OptionType } from './option-type';

interface SelectProps {
  label?: string;
  selected: OptionType;
  options: OptionType[];
  onChangeOption: (selected: OptionType) => void;
  checked?: boolean;
  disabled?: boolean;
  className?: string;
  wrapperClassName?: string;
}

const Select: React.FC<SelectProps> = ({
  label,
  selected,
  options,
  onChangeOption,
  checked = false,
  disabled = false,
  className,
  wrapperClassName,
  ...props
}) => {
  return (
    <Field className={cn('flex flex-col gap-0.5', wrapperClassName)}>
      {label && <Label className="text-xs text-gray-500">{label}</Label>}
      <Listbox value={selected} onChange={onChangeOption} disabled={disabled} as="div">
        {({ open }) => (
          <>
            <ListboxButton
              className={cn(
                'relative block h-10 w-full rounded border border-gray-300 bg-white py-2.5 pl-3.5 pr-11 text-left',
                'hover:border-blue-600 hover:bg-gray-100',
                'focus:bg-gray-100 focus:outline-none focus:outline-2 focus:-outline-offset-2 focus:outline-blue-500',
                {
                  ['uikit-disabled-field']: disabled,
                  ['bg-gray-100 outline-none outline-2 -outline-offset-2 outline-blue-500']: open,
                },
                className
              )}
              {...props}
            >
              <p
                title={selected.title}
                className={cn('line-clamp-1 text-sm font-normal text-gray-800', {
                  ['text-gray-300']: disabled,
                })}
              >
                {selected.title}
              </p>
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
                'uikit-card-shadow transition duration-100 ease-in data-[leave]:data-[closed]:opacity-0'
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
                  <p title={option.title} className="text-sm font-normal text-gray-800">
                    {option.title}
                  </p>
                </ListboxOption>
              ))}
            </ListboxOptions>
          </>
        )}
      </Listbox>
    </Field>
  );
};

export default Select;
