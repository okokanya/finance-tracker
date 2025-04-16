import { useCategoriesStore } from '@/features/category/category.store';
import { texts } from '@/features/category/category.texts';
import { CategoryForm } from '@/features/category/category.types';
import { useEditCategory } from '@/features/category/controllers/edit-category';

import Modal from '../base/modal';
import { useNotificationStore } from '../notification/notification.store';
import CategoryModalForm from './category-modal-form';

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function CategoryEditModal({ isOpen, onClose }: Props) {
  const selectedCategory = useCategoriesStore(store => store.selectedCategory);
  const show = useNotificationStore(store => store.show);

  const { mutate } = useEditCategory();

  const handleSubmitForm = (fetchBody: CategoryForm) => {
    if (!selectedCategory) {
      show('Ошибка при редактировании, не выбрана категория');
    } else {
      mutate(
        { fetchBody, id: selectedCategory.id },
        {
          onSettled: () => {
            onClose();
          },
        }
      );
    }
  };

  return (
    <Modal
      title={`${texts.modal.edit} ${selectedCategory?.name}`}
      isOpen={isOpen}
      onClose={onClose}
    >
      <CategoryModalForm
        isEdit={true}
        onClose={onClose}
        onSuccess={handleSubmitForm}
        name={selectedCategory?.name}
        description={selectedCategory?.description}
      />
    </Modal>
  );
}
