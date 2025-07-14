import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Formik, Field, Form } from 'formik'
import { useDispatch } from 'react-redux'
import { login } from '../slices/authSlice'
import axios from 'axios'


const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <Formik
      initialValues={{
        username: '',
        password: '',
      }}
      onSubmit={async (values, { setSubmitting, setErrors }) => {
        try {
          const response = await axios.post('/api/v1/login', values)
          dispatch(login(response.data));
          navigate('/');
        } catch (error) {
          setErrors({ password: error.message });
        } finally {
          setSubmitting(false)
        }
      }}
    >
      <Form>
        <label htmlFor="username">Ваш ник</label>
        <Field id="username" name="username" placeholder="Ваш ник" />

        <label htmlFor="password">Пароль</label>
        <Field id="password" name="password" placeholder="Пароль" type="password"/>

        <button type="submit">Войти</button>
      </Form>
    </Formik>
  )
}

export default LoginPage