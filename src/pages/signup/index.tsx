import React, { useState } from 'react';
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

Signup.title = 'Регистрация';

export default function Signup() {
  const [submitError, setSubmitError] = useState<string | null>(null);
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
      router.push('/signin');
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
      <FormWrap>
        <h1 className="ml-0 mr-auto">Регистрация</h1>
        <form className="flex w-full flex-wrap justify-between" onSubmit={handleSubmit(onSubmit)}>
          <Input
            label="Имя"
            placeholder="Имя"
            {...register('firstName')}
            errorText={errors.firstName?.message}
          />
          <Input
            label="Фамилия"
            placeholder="Фамилия"
            {...register('lastName')}
            errorText={errors.lastName?.message}
          />
          <Input
            label="Email"
            type="email"
            placeholder="Email"
            {...register('email')}
            errorText={errors.email?.message}
          />
          <Input
            label="Придумайте пароль"
            type="password"
            placeholder="Пароль"
            {...register('password')}
            errorText={errors.password?.message}
          />
          <Input
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
    </MainWrap>
  );
}
