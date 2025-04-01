import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import Button from '@/components/base/button';
import Input from '@/components/base/input';
import { texts } from '@/features/category/category.texts';
import { CategoryForm, categoryFormSchema } from '@/features/category/category.types';
import { Category } from '@/models';
import { cn } from '@/utils/cn';

type CategoryModalProps = {
  isEdit?: boolean;
  onClose: () => void;
  onSuccess: (data: CategoryForm) => void;
  name?: Category['name'];
  description?: Category['description'];
  onDelete?: () => void;
};

const CategoryModalForm: React.FC<CategoryModalProps> = ({
  isEdit,
  onClose,
  onSuccess,
  name,
  description,
  onDelete,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CategoryForm>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: { name, description },
  });

  const handleFormSubmit = (data: CategoryForm) => {
    onSuccess(data);
    handleCancel();
  };

  const handleCancel = () => {
    onDelete?.();
    reset();
    onClose();
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className={cn('flex flex-col gap-4')}>
      <Input
        label={texts.form.name}
        placeholder={texts.form.namePlaceholder}
        {...register('name')}
        errorText={errors?.name?.message}
        className={cn('w-full')}
      />
      <Input
        label={texts.form.description}
        placeholder={texts.form.descriptionPlaceholder}
        {...register('description')}
        errorText={errors?.description?.message}
        className={cn('w-full')}
      />
      <div className="flex gap-2">
        <Button variant="primary" type="submit" className={cn('w-full max-w-[420px]')}>
          {isEdit ? 'Сохранить' : 'Добавить категорию'}
        </Button>
        <Button
          onClick={handleCancel}
          className={cn('w-full max-w-28')}
          variant={isEdit ? 'error' : 'secondary'}
        >
          {isEdit ? 'Удалить' : 'Отменить'}
        </Button>
      </div>
    </form>
  );
};

export default CategoryModalForm;
