import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useMutation } from '@tanstack/react-query';
import { SubmitHandler, useForm } from 'react-hook-form';

import Button from '@/components/button';
import FormWrap from '@/components/formWrap';
import Input from '@/components/input/input';
import MainWrap from '@/components/mainWrap';

const Signin = () => {
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
      router.push('/profile');
    },
    onError: () => {
      alert('Неверный email или пароль');
    },
  });

  const onSubmit: SubmitHandler<{ email: string; password: string }> = data => {
    mutation.mutate(data);
  };

  return (
    <MainWrap>
      <FormWrap>
        <h1 className="ml-0 mr-auto">Вход в аккаунт</h1>
        <form
          className="flex w-full flex-col flex-wrap justify-between"
          onSubmit={handleSubmit(onSubmit)}
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
    </MainWrap>
  );
};

Signin.title = 'Вход';
export default Signin;
