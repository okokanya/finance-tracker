import { PlusIcon } from '@heroicons/react/24/outline';

import { cn } from '@/utils/cn';

import Text from '../base/text';

type Props = {
  onClick: () => void;
};

export default function NewCategory({ onClick }: Props) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'uikit-card-shadow flex max-w-72 cursor-pointer flex-row gap-2 rounded-lg border border-blue-500 px-6 py-4 hover:border hover:border-blue-600 hover:bg-white'
      )}
    >
      <div className={cn('flex w-full max-w-[210px] flex-col bg-transparent')}>
        <Text isBold className="line-clamp-1">
          Новая категория
        </Text>
        <Text variant="sm" className="line-clamp-2 text-gray-500">
          Добавить категорию
        </Text>
      </div>
      <div className={cn('h-6 w-6 self-center justify-self-center')}>
        <PlusIcon className="stroke-blue-500" />
      </div>
    </div>
  );
}
