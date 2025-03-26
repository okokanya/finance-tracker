import Button from '@/components/base/button';
import Modal, { ModalProps } from '@/components/base/modal';
import Text from '@/components/base/text';
import { MODAL_CONTENT_CLASS } from '@/components/util/common-classes';
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
      <div className={MODAL_CONTENT_CLASS}>
        <div className="mt-1 w-full md:mt-3">
          <Text className="text-gray-500">{description}</Text>
        </div>
        <div className="flex w-full flex-col gap-2 md:flex-row">
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
