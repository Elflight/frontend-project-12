import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useFormik } from 'formik'
import { useDispatch } from 'react-redux'
import { login } from '../slices/authSlice'
import axios from 'axios'

import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Alert from 'react-bootstrap/Alert'


const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [authError, setAuthError] = useState(null)

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const response = await axios.post('/api/v1/login', values)
        dispatch(login(response.data));
        navigate('/');
      } catch {
        setAuthError('Неверные имя пользователя или пароль');
      } finally {
        setSubmitting(false)
      }
    }
  })

  return (
    <Container fluid className="h-100">
      <Row className="justify-content-center align-items-center h-100">
        <Col xs={12} md={6} lg={4}>
          <Card className="p-4 shadow-sm">
            <Card.Body>
              <Card.Title className="mb-4 text-center">Войти</Card.Title>

              {authError && <Alert variant="danger">{authError}</Alert>}

              <Form onSubmit={formik.handleSubmit}>
                <Form.Group className="mb-3" controlId="username">
                  <Form.Label>Ваш ник</Form.Label>
                  <Form.Control
                    type="text"
                    name="username"
                    placeholder="Введите имя"
                    value={formik.values.username}
                    onChange={formik.handleChange}
                    isInvalid={!!authError}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="password">
                  <Form.Label>Пароль</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    placeholder="Введите пароль"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    isInvalid={!!authError}
                  />
                </Form.Group>

                <Button
                  variant="primary"
                  type="submit"
                  className="w-100"
                  disabled={formik.isSubmitting}
                >
                  Войти
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default LoginPage