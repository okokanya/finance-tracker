import { useMemo } from 'react';

import Modal from '@/components/base/modal';
import { texts } from '@/features/category/category.texts';
import { CategoryForm } from '@/features/category/category.types';
import useAddCategory from '@/features/category/controllers/add-category';
import { CategoryType } from '@/types/enums';

import CategoryModalForm from './category-modal-form';

type CategoryModalProps = {
  isOpen: boolean;
  onClose: () => void;
  categoryName?: string;
  type: CategoryType;
};

const CategoryModal: React.FC<CategoryModalProps> = ({ isOpen, onClose, categoryName, type }) => {
  const isNew = useMemo(() => !categoryName, [categoryName]);

  const modalTitle = useMemo(() => {
    return !isNew ? `${texts.modal.new} ${categoryName}` : texts.modal.new;
  }, [categoryName, isNew]);

  const { mutate: mutateAdd } = useAddCategory();

  const handleSubmitForm = (data: CategoryForm) => {
    mutateAdd(
      { ...data, type },
      {
        onSettled: () => {
          onClose();
        },
      }
    );
  };

  return (
    <Modal title={modalTitle} isOpen={isOpen} onClose={onClose}>
      <CategoryModalForm isEdit={!isNew} onClose={onClose} onSuccess={handleSubmitForm} />
    </Modal>
  );
};

export default CategoryModal;
