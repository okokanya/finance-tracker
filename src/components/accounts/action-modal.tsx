import Button from '@/components/button';
import Modal, { ModalProps } from '@/components/modal/modal';
import Text from '@/components/text/text';
import texts from '@/features/accounts/accounts.texts';

type Props = Omit<ModalProps, 'children'> & {
  description: string;
  submit?: string;
  cancel?: string;
  onSuccess: () => void;
};

export default function ActionModal({
  title,
  description,
  submit = texts.repeat,
  cancel = texts.cancel,
  isOpen,
  onClose,
  onSuccess,
}: Props) {
  return (
    <Modal title={title} isOpen={isOpen} onClose={onClose}>
      <div className="flex w-full flex-col gap-6">
        <div className="mt-3 w-full">
          <Text className="text-gray-500">{description}</Text>
        </div>
        <div className="flex w-full gap-2">
          <Button onClick={onSuccess} className="w-full">
            {submit}
          </Button>
          <Button variant="secondary" onClick={onClose} className="w-full">
            {cancel}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
