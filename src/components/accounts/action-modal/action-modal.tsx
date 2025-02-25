import Button from '@/components/button';
import Modal, { ModalProps } from '@/components/modal/modal';
import Text from '@/components/text/text';
import texts from '@/features/accounts/accounts.texts';

type ActionModalProps = Omit<ModalProps, 'children'> & {
  description: string;
  submit?: string;
  cancel?: string;
  onSuccess: () => void;
};

const ActionModal: React.FC<ActionModalProps> = ({
  title,
  description,
  submit = texts.repeat,
  cancel = texts.cancel,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const handleSubmit = () => {
    onSuccess();
  };

  return (
    <Modal title={title} isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit} className="flex w-full flex-col gap-6">
        <div className="mt-3 w-full">
          <Text className="text-gray-500">{description}</Text>
        </div>
        <div className="flex w-full gap-2">
          <Button type="submit" className="w-full">
            {submit}
          </Button>
          <Button variant="secondary" onClick={onClose} className="w-full">
            {cancel}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ActionModal;
