import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import MainWrap from '@/components/mainWrap';
import FormWrap from '@/components/formWrap';
import Button from '@/components/button';
import Link from 'next/link';

const schema = z.object({
  firstName: z.string().min(1, 'Это поле обязательно'),
  lastName: z.string().min(1, 'Это поле обязательно'),
  email: z.string().email('Некорректный email'),
  password: z.string().min(6, 'Пароль должен содержать минимум 6 символов'),
  passwordCheck: z.string().min(6, 'Пароль должен содержать минимум 6 символов'),
}).refine((data) => data.password === data.passwordCheck, {
  message: 'Пароли не совпадают',
  path: ['passwordCheck'],
});

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

  const onSubmit: SubmitHandler<FormData> = (data) => {
    mutation.mutate(data);
  };

  return (
    <MainWrap>
      <FormWrap>
        <h1 className="ml-0 mr-auto">Регистрация</h1>
        <form className="flex flex-wrap w-full justify-between" onSubmit={handleSubmit(onSubmit)}>
          <label className="label half-width">
            Имя
            <input className="input-txt" placeholder="Имя" {...register('firstName')} />
            {errors.firstName && <span className="errorSpan">{errors.firstName.message}</span>}
          </label>

          <label className="label half-width">
            Фамилия
            <input className="input-txt" placeholder="Фамилия" {...register('lastName')} />
            {errors.lastName && <span className="errorSpan">{errors.lastName.message}</span>}
          </label>

          <label className="label">
            Email
            <input className="input-txt" placeholder="email" type="email" {...register('email')} />
            {errors.email && <span className="errorSpan">{errors.email.message}</span>}
          </label>

          <label className="label half-width">
            Придумайте пароль
            <input className="input-txt" placeholder="Пароль" type="password" {...register('password')} />
            {errors.password && <span className="errorSpan">{errors.password.message}</span>}
          </label>

          <label className="label half-width">
            Повторите пароль
            <input className="input-txt" placeholder="Повторите пароль" type="password" {...register('passwordCheck')} />
            {errors.passwordCheck && <span className="errorSpan">{errors.passwordCheck.message}</span>}
          </label>

          {submitError && <span className="errorSpan">{submitError}</span>}

          <Button>
            <input type="submit" value="Зарегистрироваться" />
          </Button>
        </form>

        <p className="ml-0 mr-auto mt-10">
          Уже есть аккаунт? <Link className="link" href="/signin">Войти</Link>
        </p>
      </FormWrap>
    </MainWrap>
  );
}
