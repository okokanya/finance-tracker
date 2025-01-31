import Input from '@/components/input/input';
import { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

const meta = {
  title: 'Components/Input',
  component: Input,
  parameters: {
    layout: "centered",
  },
  tags: ['autodocs'],
  args: {
    onChange: fn(),
    placeholder: '',
    errorText: ''
  }

} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {

  args: {
    value: 'Input value',
  }
}
export const DefaultWithPlaceholder: Story = {
  args: {
    placeholder: 'placeholder'
  }
}

export const Error: Story = {
  args: {
    value: 'Invalid input',
    errorText: 'Some error here'
  }
}

export const DisabledDefault: Story = {
  args: {
    value: 'disabled input',
    disabled: true
  }
}

export const DisabledError: Story = {
  args: {
    value: 'disabled input with error',
    disabled: true,
    errorText: 'Some error here'
  }
}
