import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';

import Button from '@/components/base/button';
import Input from '@/components/base/input';
import Modal from '@/components/base/modal';
import Title from '@/components/base/title';
import FormWrap from '@/components/form-wrap';
import LogoTitle from '@/components/logo-title';
import MainWrap from '@/components/main-wrap';

const schema = z
  .object({
    firstName: z.string().min(1, 'Это поле обязательно'),
    lastName: z.string().min(1, 'Это поле обязательно'),
    email: z.string().email('Некорректный email'),
    password: z.string().min(6, 'Пароль должен содержать минимум 6 символов'),
    passwordCheck: z.string().min(6, 'Пароль должен содержать минимум 6 символов'),
  })
  .refine(data => data.password === data.passwordCheck, {
    message: 'Пароли не совпадают',
    path: ['passwordCheck'],
  });

// типизация формы
type FormData = z.infer<typeof schema>;

export default function Signup() {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // управление модальным окном

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const router = useRouter();

  const mutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          password: data.password,
        }),
      });

      if (!response.ok) {
        throw new Error('Ошибка при отправке данных');
      }

      return response.json();
    },
    onSuccess: () => {
      setSubmitError(null);
      setIsModalOpen(true); // модальное окно
      setTimeout(() => {
        setIsModalOpen(false); // закрываем модальное окно через 2 секунды
        router.push('/signin');
      }, 2000);
    },
    onError: () => {
      setSubmitError('Произошла ошибка при регистрации. Попробуйте еще раз.');
    },
  });

  const onSubmit: SubmitHandler<FormData> = data => {
    mutation.mutate(data);
  };

  return (
    <MainWrap>
      <LogoTitle />
      <FormWrap smWidth="sm:w-[32rem]">
        <Title
          variant="h1"
          className="my-4 w-full text-left"
          id="main-title"
          aria-label="Главный заголовок"
        >
          Регистрация
        </Title>
        <form className="flex w-full flex-wrap justify-between" onSubmit={handleSubmit(onSubmit)}>
          <Input
            wrapperClassName="w-full sm:w-1/2 mb-2"
            label="Имя"
            placeholder="Ярополк"
            {...register('firstName')}
            errorText={errors.firstName?.message}
          />
          <Input
            wrapperClassName="w-full sm:w-1/2 mb-2"
            className="w-full"
            label="Фамилия"
            placeholder="Иванов"
            {...register('lastName')}
            errorText={errors.lastName?.message}
          />
          <Input
            wrapperClassName="w-full mb-2"
            className="w-full"
            label="Email"
            type="email"
            placeholder="ivanov@ya.com"
            {...register('email')}
            errorText={errors.email?.message}
          />
          <Input
            wrapperClassName="w-full sm:w-1/2 mb-2"
            // className="w-full"
            label="Придумайте пароль"
            type="password"
            placeholder="******"
            {...register('password')}
            errorText={errors.password?.message}
          />
          <Input
            wrapperClassName="w-full sm:w-1/2 mb-2"
            className="w-full"
            label="Повторите пароль"
            type="password"
            placeholder="******"
            {...register('passwordCheck')}
            errorText={errors.passwordCheck?.message}
          />

          {submitError && <span className="uikit-error">{submitError}</span>}

          <Button type="submit">Зарегистрироваться</Button>
        </form>

        <p className="ml-0 mr-auto mt-10">
          Уже есть аккаунт?{' '}
          <Link className="uikit-link" href="/signin">
            Войти
          </Link>
        </p>
      </FormWrap>

      {/* Модальное окно для успешной регистрации */}
      <Modal
        title="Успешная регистрация"
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <p>Вы успешно зарегистрировались!</p>
      </Modal>
    </MainWrap>
  );
}

export async function getServerSideProps() {
  return {
    props: {
      hideHeader: true,
      title: 'Регистрация',
    },
  };
}
