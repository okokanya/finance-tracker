import type { Meta, StoryObj } from '@storybook/react';
import Accordion from '@/components/accordion/accordion';
import Input from '@/components/input/input';

const meta = {
  title: 'Components/Accordion',
  component: Accordion,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Main: Story = {
  args: {
    title: 'Операции по счёту',
    children: (
      <div className="mt-2 flex flex-col gap-2">
        <Input />
        <Input placeholder="Placeholder" />
        <Input errorText="Error text" />
        <Input disabled value="Disabled" />
      </div>
    )
  },
};
