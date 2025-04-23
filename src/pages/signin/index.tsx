import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useMutation } from '@tanstack/react-query';
import { SubmitHandler, useForm } from 'react-hook-form';

import Button from '@/components/base/button';
import Input from '@/components/base/input';
import Modal from '@/components/base/modal';
import Title from '@/components/base/title';
import FormWrap from '@/components/form-wrap';
import LogoTitle from '@/components/logo-title';
import MainWrap from '@/components/main-wrap';
import { useProfileController } from '@/features/profile/profile.controller';
import { User } from '@/features/profile/profile.types';

interface SignInData {
  email: string;
  password: string;
}

interface AuthResponse {
  user?: User;
}

const Signin = () => {
  const [isModalOpen, setIsModalOpen] = useState(false); // успешный вход
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false); // ошибка входа

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInData>();

  const router = useRouter();
  const { onLogin } = useProfileController();

  const mutation = useMutation<AuthResponse, Error, SignInData>({
    mutationFn: async (data: SignInData) => {
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Ошибка при входе');
      }

      return response.json();
    },
    onSuccess: data => {
      if (data.user) onLogin(data.user);
      setIsModalOpen(true); // меняем состояние на удачном входе
      setTimeout(() => {
        setIsModalOpen(false);
        router.push('/accounts');
      }, 2000);
    },
    onError: () => {
      setIsErrorModalOpen(true); // модальное окно с ошибкой
    },
  });

  const onSubmit: SubmitHandler<SignInData> = data => {
    mutation.mutate(data);
  };

  return (
    <MainWrap>
      <LogoTitle />
      <FormWrap>
        <Title
          variant="h1"
          className="my-4 w-full text-left"
          id="main-title"
          aria-label="Главный заголовок"
        >
          Вход
        </Title>
        <form
          className="flex w-full flex-col flex-wrap justify-between"
          onSubmit={handleSubmit(onSubmit)}
          autoComplete="on"
        >
          <Input
            label="Email"
            type="email"
            className="mb-4 w-full"
            placeholder="ivanov@ya.com"
            {...register('email', { required: 'Email обязателен' })}
            errorText={errors.email?.message}
          />
          <Input
            label="Пароль"
            type="password"
            className="mb-4 w-full"
            placeholder="*******"
            {...register('password', { required: 'Пароль обязателен' })}
            errorText={errors.password?.message}
          />
          <Button type="submit">Войти</Button>
        </form>
        <p className="ml-0 mr-auto mt-10">
          У вас еще нет аккаунта?{' '}
          <Link className="uikit-link" href="/signup">
            Зарегистрироваться
          </Link>
        </p>
      </FormWrap>

      {/* модальное окно для успешного входа */}
      <Modal title="Успешный вход" isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <p>Вы успешно вошли в систему!</p>
      </Modal>

      {/* модальное окно для ошибки входа */}
      <Modal
        title="Ошибка входа"
        isOpen={isErrorModalOpen}
        onClose={() => setIsErrorModalOpen(false)}
      >
        <p>Неправильный email или пароль</p>
      </Modal>
    </MainWrap>
  );
};

export async function getServerSideProps() {
  return {
    props: {
      hideHeader: true,
      title: 'Вход',
    },
  };
}

export default Signin;
