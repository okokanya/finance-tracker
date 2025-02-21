import React, { useState } from 'react';
import { useForm, SubmitHandler } from "react-hook-form";
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import MainWrap from '@/components/mainWrap';
import FormWrap from '@/components/formWrap';
import Button from '@/components/button';

type FormData = {
  email: string;
  password: string;
};

Signin.title = "Вход";

export default function Signin() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormData>();

  const router = useRouter();
  const mutation = useMutation({
    mutationFn: async (data: FormData) => {
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
    // onError: () => {
    //   alert('Неверный email или пароль');
    // },
  });

  const onSubmit: SubmitHandler<FormData> = (data) => {
    mutation.mutate(data);
  };

  return (
    <MainWrap>
      <FormWrap>
        <h1 className='ml-0 mr-auto'>Вход в аккаунт</h1>
        <form className='flex flex-wrap w-full justify-between' onSubmit={handleSubmit(onSubmit)}>
          <label className="label">Email
            <input className="input-txt" placeholder="email" type="email" {...register("email", { required: true })} />
            {errors.email && <span className='errorSpan'>Это поле обязательно</span>}
          </label>

          <label className="label">Пароль
            <input
              className="input-txt"
              placeholder="Пароль"
              type="password"
              {...register("password", { required: true })}
              id="password"
            />
            {errors.password && <span className='errorSpan'>Это поле обязательно</span>}
          </label>

          <Button>
            <input type="submit" />
          </Button>
        </form>

        <p className='ml-0 mr-auto mt-10'>У вас еще нет аккаунта? <a className="link" href='/signup'>Зарегистрироваться</a></p>
      </FormWrap>
    </MainWrap>
  );
}
