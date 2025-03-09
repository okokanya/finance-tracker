import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import Button from '@/components/button';
import Input from '@/components/input/input';
import { texts } from '@/features/category/category.texts';
import { CategoryForm, categoryFormSchema } from '@/features/category/category.types';

type CategoryModalProps = {
  isEdit?: boolean;
  onClose: () => void;
  onSuccess: (data: CategoryForm) => void;
};

const CategoryModalForm: React.FC<CategoryModalProps> = ({ isEdit, onClose, onSuccess }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CategoryForm>({ resolver: zodResolver(categoryFormSchema) });

  const handleFormSubmit = (data: CategoryForm) => {
    onSuccess(data);
    handleCancel();
  };

  const handleCancel = () => {
    reset();
    onClose();
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <Input
        /* label={texts.form.name} */ placeholder={texts.form.namePlaceholder}
        {...register('name')}
        errorText={errors?.name?.message}
      />
      <Input
        /* label={texts.form.description} */ placeholder={texts.form.descriptionPlaceholder}
        {...register('description')}
        errorText={errors?.description?.message}
      />
      <div>
        <Button variant="primary" type="submit">
          Сохранить
        </Button>
        <Button onClick={handleCancel} variant={isEdit ? 'error' : 'secondary'}>
          {isEdit ? 'Удалить' : 'Отменить'}
        </Button>
      </div>
    </form>
  );
};

export default CategoryModalForm;
