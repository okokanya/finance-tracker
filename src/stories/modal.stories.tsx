import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import Input from '@/components/input/input';
import Modal from '@/components/modal/modal';

const meta = {
  title: 'Components/Modal',
  component: Modal,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Main: Story = {
  args: {
    title: 'Модальное окно',
    isOpen: true,
    onClose: fn(),
    children: (
      <div className="mt-2 flex flex-col gap-2">
        <Input />
        <Input placeholder="Placeholder" />
        <Input errorText="Error text" />
        <Input disabled value="Disabled" />
      </div>
    ),
  },
};
