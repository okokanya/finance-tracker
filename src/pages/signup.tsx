import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/router'; // Импортируем useRouter для редиректа
import MainWrap from '@/components/mainWrap';
import FormWrap from '@/components/formWrap';
import Button from '@/components/button';

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  passwordCheck: string;
};

Signup.title = 'Регистрация';

export default function Signup() {
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormData>();

  const router = useRouter(); // Хук для навигации в Next.js

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
    onSuccess: (data) => {
      console.log('Успешно:', data);
      setSubmitError(null);
      router.push('/signin'); // Редирект на страницу входа
    },
    onError: (error) => {
      console.error('Ошибка:', error);
      setSubmitError('Произошла ошибка при регистрации. Попробуйте еще раз.');
    },
  });

  const onSubmit: SubmitHandler<FormData> = (data) => {
    if (data.password !== data.passwordCheck) {
      setPasswordMatch(false);
      return;
    }

    // Вызываем мутацию
    mutation.mutate(data);
  };

  const handlePasswordCheckBlur = () => {
    const password = document.getElementById('password') as HTMLInputElement;
    const passwordCheck = document.getElementById('passwordCheck') as HTMLInputElement;

    if (password.value !== passwordCheck.value) {
      setPasswordMatch(false);
      setValue('passwordCheck', '');
    } else {
      setPasswordMatch(true);
    }
  };

  return (
    <MainWrap>
      <FormWrap>
        <h1 className="ml-0 mr-auto">Регистрация</h1>
        <form className="flex flex-wrap w-full justify-between" onSubmit={handleSubmit(onSubmit)}>
          <label className="label half-width">
            Имя
            <input className="input-txt" placeholder="Имя" {...register('firstName', { required: true })} />
            {errors.firstName && <span className="errorSpan">Это поле обязательно</span>}
          </label>

          <label className="label half-width">
            Фамилия
            <input className="input-txt" placeholder="Фамилия" {...register('lastName', { required: true })} />
            {errors.lastName && <span className="errorSpan">Это поле обязательно</span>}
          </label>

          <label className="label">
            Email
            <input className="input-txt" placeholder="email" type="email" {...register('email', { required: true })} />
            {errors.email && <span className="errorSpan">Это поле обязательно</span>}
          </label>

          <label className="label half-width">
            Придумайте пароль
            <input
              className="input-txt"
              placeholder="Пароль"
              type="password"
              {...register('password', { required: true })}
              id="password"
            />
            {errors.password && <span className="errorSpan">Это поле обязательно</span>}
          </label>

          <label className="label half-width">
            Повторите пароль
            <input
              className="input-txt"
              placeholder="Повторите пароль"
              type="password"
              {...register('passwordCheck', { required: true })}
              id="passwordCheck"
              onBlur={handlePasswordCheckBlur}
            />
            {(!passwordMatch || errors.passwordCheck) && <span className="errorSpan">Поля не совпадают</span>}
          </label>

          {submitError && <span className="errorSpan">{submitError}</span>}

          <Button>
            <input type="submit" value="Зарегистрироваться" />
          </Button>
        </form>

        <p className="ml-0 mr-auto mt-10">
          Уже есть аккаунт? <a className="link" href="/signin">Войти</a>
        </p>
      </FormWrap>
    </MainWrap>
  );
}
