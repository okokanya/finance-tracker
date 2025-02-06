import React, { useState } from 'react';
import { useForm, SubmitHandler } from "react-hook-form";
import MainWrap from '@/components/mainWrap';
import FormWrap from '@/components/formWrap';
import Button from '@/components/button';
import { registerUser } from '@/utils/api';

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  passwordCheck: string;
};

export default function Signup() {
  const [passwordMatch, setPasswordMatch] = useState(true); // State to track password match
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormData>();

  const onSubmit: SubmitHandler<FormData> = (data) => console.log(data);

  const handlePasswordCheckBlur = () => {
    const password = document.getElementById('password') as HTMLInputElement;
    const passwordCheck = document.getElementById('passwordCheck') as HTMLInputElement;

    if (password.value !== passwordCheck.value) {
      setPasswordMatch(false);
      setValue('passwordCheck', ''); // Clear the passwordCheck field
    } else {
      setPasswordMatch(true);
    }
  };

  return (
    <MainWrap>
      <FormWrap>
        <h1 className='ml-0 mr-auto'>Регистрация</h1>
        <form className='flex flex-wrap w-full justify-between' onSubmit={handleSubmit(onSubmit)}>
          <label className="label half-width">Имя
            <input className="input-txt" placeholder="Имя" {...register("firstName", { required: true })} />
            {errors.firstName && <span className='errorSpan'>Это поле обязательно</span>}
          </label>

          <label className="label half-width">Фамилия
            <input className="input-txt" placeholder="Фамилия" {...register("lastName", { required: true })} />
            {errors.lastName && <span className='errorSpan'>Это поле обязательно</span>}
          </label>

          <label className="label">Email
            <input className="input-txt" placeholder="email" type="email" {...register("email", { required: true })} />
            {errors.email && <span className='errorSpan'>Это поле обязательно</span>}
          </label>

          <label className="label half-width">Придумайте пароль
            <input
              className="input-txt"
              placeholder="Пароль"
              type="password"
              {...register("password", { required: true })}
              id="password"
            />
            {errors.password && <span className='errorSpan'>Это поле обязательно</span>}
          </label>

          <label className="label half-width">Повторите пароль
            <input
              className="input-txt"
              placeholder="Повторите пароль"
              type="password"
              {...register("passwordCheck", { required: true })}
              id="passwordCheck"
              onBlur={handlePasswordCheckBlur}
            />
            {(!passwordMatch || errors.passwordCheck) && <span className='errorSpan'>Поля не совпадают</span>}
          </label>

          <Button>
            <input type="submit" />
          </Button>
        </form>

        <p className='ml-0 mr-auto mt-10'>Уже есть аккаунт? <a className="link" href='/signin'>Войти</a></p>
      </FormWrap>
    </MainWrap>
  );
}
