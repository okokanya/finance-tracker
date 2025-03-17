import { useMemo } from 'react';

import Modal from '@/components/base/modal';
import { useIsCategoryEdit } from '@/features/category/category.store';
import { texts } from '@/features/category/category.texts';
import { CategoryForm } from '@/features/category/category.types';

import CategoryModalForm from './category-modal-form';

type CategoryModalProps = {
  isOpen: boolean;
  onClose: () => void;
  categoryName?: string;
};

const CategoryModal: React.FC<CategoryModalProps> = ({ isOpen, onClose, categoryName }) => {
  const isEdit = useIsCategoryEdit();
  const modalTitle = useMemo(() => {
    if (isEdit) {
      return `${texts.modal.edit} ${categoryName ?? ''}`;
    }

    return texts.modal.new;
  }, [categoryName, isEdit]);

  const handleSubmitForm = (data: CategoryForm) => {
    console.log(data);
  };

  return (
    <Modal title={modalTitle} isOpen={isOpen} onClose={onClose}>
      <CategoryModalForm isEdit={isEdit} onClose={onClose} onSuccess={handleSubmitForm} />
    </Modal>
  );
};

export default CategoryModal;
