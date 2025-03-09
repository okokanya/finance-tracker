import { useMemo } from 'react';

import Modal from '@/components/modal/modal';
import { texts } from '@/features/category/category.texts';
import { CategoryForm } from '@/features/category/category.types';

import CategoryModalForm from '../category-modal-form/category-modal-form';

type CategoryModalProps = {
  isEdit?: boolean;
  isOpen: boolean;
  onClose: () => void;
  categoryName?: string;
};

const CategoryModal: React.FC<CategoryModalProps> = ({ isEdit, isOpen, onClose, categoryName }) => {
  const modalTitle = useMemo(() => {
    if (isEdit) {
      return `${texts.modal.edit} ${categoryName ?? ''}`;
    }

    return texts.modal.new;
  }, [categoryName, isEdit]);

  const handleSubmitForm = (data: CategoryForm) => {};

  return (
    <Modal title={modalTitle} isOpen={isOpen} onClose={onClose}>
      <CategoryModalForm isEdit={isEdit} onClose={onClose} onSuccess={handleSubmitForm} />
    </Modal>
  );
};

export default CategoryModal;
