import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useMutation } from '@tanstack/react-query';
import { SubmitHandler, useForm } from 'react-hook-form';

import Button from '@/components/button';
import FormWrap from '@/components/formWrap';
import Input from '@/components/input/input';
import MainWrap from '@/components/mainWrap';
import Modal from '@/components/modal/modal';

import logo from '@public/txt-logo.svg';

const Signin = () => {
  const [isModalOpen, setIsModalOpen] = useState(false); // успешный вход
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false); // ошибка входа

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ email: string; password: string }>();

  const router = useRouter();
  const mutation = useMutation({
    mutationFn: async data => {
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
    onSuccess: () => {
      setIsModalOpen(true); // меняем состояние на удачном входе
      setTimeout(() => {
        setIsModalOpen(false);
        router.push('/profile');
      }, 2000);
    },
    onError: () => {
      setIsErrorModalOpen(true); // модальное окно с ошибкой
    },
  });

  const onSubmit: SubmitHandler<{ email: string; password: string }> = data => {
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
      <FormWrap>
        <h1 className="ml-0 mr-auto">Вход в аккаунт</h1>
        <form
          className="flex w-full flex-col flex-wrap justify-between"
          onSubmit={handleSubmit(onSubmit)}
          autoComplete="on"
        >
          <Input
            label="Email"
            type="email"
            className="mb-4"
            placeholder="Email"
            {...register('email', { required: true })}
            errorText={errors.email?.message}
          />
          <Input
            label="Пароль"
            type="password"
            className="mb-4"
            placeholder="Пароль"
            {...register('password', { required: true })}
            errorText={errors.password?.message}
          />
          <Button>
            <input type="submit" />
          </Button>
        </form>
        <p className="ml-0 mr-auto mt-10">
          У вас еще нет аккаунта?{' '}
          <Link className="link" href="/signup">
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
