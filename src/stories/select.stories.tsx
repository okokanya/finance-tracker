import type { Meta, StoryObj } from '@storybook/react';
import { OptionType } from '@/components/select/option-type';
import Select from '@/components/select/select';

const options = [
  { title: '1 опция', value: '1' },
  { title: '2 опция', value: '2' },
  { title: '3 опция', value: '3' },
  { title: '4 опция', value: '4' },
];

const meta = {
  title: 'Components/Select',
  component: Select,
  parameters: {
    layout: 'centered',
  },
  args: {
    options: options,
    onChangeOption: (selected: OptionType) => {
      console.log(`выбран: title - ${selected.title}, value - ${selected.value}`)
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Main: Story = {
  args: {},
};

export const Scroll: Story = {
  args: {
    optionsWrapperClassName: 'max-h-[150px]',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

