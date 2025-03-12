import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';

import Button from '@/components/button';
import FormWrap from '@/components/formWrap';
import Input from '@/components/input/input';
import MainWrap from '@/components/mainWrap';
import Modal from '@/components/modal/modal';

import logo from '../../../public/txt-logo.svg';

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
      <Image
        src={logo}
        alt="Логотип трекера"
        width={300}
        height={50}
        className="mb-6 hidden sm:block"
      />
      <FormWrap width="36.25rem">
        <h1 className="ml-0 mr-auto">Регистрация</h1>
        <form className="flex w-full flex-wrap justify-between" onSubmit={handleSubmit(onSubmit)}>
          <Input
            wrapperClassName="w-full sm:w-[48%]"
            label="Имя"
            placeholder="Имя"
            {...register('firstName')}
            errorText={errors.firstName?.message}
          />
          <Input
            wrapperClassName="w-full sm:w-[48%]"
            label="Фамилия"
            placeholder="Фамилия"
            {...register('lastName')}
            errorText={errors.lastName?.message}
          />
          <Input
            wrapperClassName="w-full"
            label="Email"
            type="email"
            placeholder="Email"
            {...register('email')}
            errorText={errors.email?.message}
          />
          <Input
            wrapperClassName="w-full sm:w-[48%]"
            label="Придумайте пароль"
            type="password"
            placeholder="Пароль"
            {...register('password')}
            errorText={errors.password?.message}
          />
          <Input
            wrapperClassName="w-full sm:w-[48%] "
            label="Повторите пароль"
            type="password"
            placeholder="Повторите пароль"
            {...register('passwordCheck')}
            errorText={errors.passwordCheck?.message}
          />

          {submitError && <span className="errorSpan">{submitError}</span>}

          <Button>
            <input type="submit" value="Зарегистрироваться" />
          </Button>
        </form>

        <p className="ml-0 mr-auto mt-10">
          Уже есть аккаунт?{' '}
          <Link className="link" href="/signin">
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
