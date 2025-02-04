import React from 'react';
import { useForm, SubmitHandler } from "react-hook-form";
import FsBg from '../components/fsBg';
import Button from '@/components/button';
type FormData = {
    firstName: string
    lastName: string
    email: string
    password: string
  }

export default function Signup() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>()
  const onSubmit: SubmitHandler<FormData> = (data) => console.log(data)

//   console.log(watch("firstName"))

  return (
  <>
  <FsBg>
  <h1>Регистрация</h1>

    <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
      <label className="flex flex-col">Имя
      <input placeholder="Имя" {...register("firstName", { required: true })} />
      {errors.lastName && <span>"Это поле обязательно"</span>}
      </label>

      <label className="flex flex-col">Фамилия
      <input placeholder="Фамилия" {...register("lastName", { required: true })} />
      {errors.lastName && <span>"Это поле обязательно"</span>}
      </label>

      <label className="flex flex-col">email
      <input  placeholder="email" {...register("email", { required: true })} />
      {errors.email && <span>Это поле обязательно</span>}
      </label>

      <label className="flex flex-col">Пароль
      <input placeholder="Пароль"  {...register("password", { required: true })} />
      {errors.password && <span>Это поле обязательно</span>}
      </label>

      <Button>
      <input type="submit" />
      </Button>
    </form>
    <p>Уже есть аккаунт? <a href='/signin'>Войти</a></p>
    </FsBg>
    </>

  )
}
