import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useDispatch } from 'react-redux'
import { login } from '../slices/authSlice'
import { useTranslation } from 'react-i18next'
import { useRollbar } from '@rollbar/react'
import { authService } from '../utils/apiClient'

import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Alert from 'react-bootstrap/Alert'

const SignupPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [signupError, setSignupError] = useState(null)
  const { t } = useTranslation()
  const rollbar = useRollbar()

  const validationSchema = Yup.object({
    username: Yup.string()
      .required(t('validation.required'))
      .min(3, t('validation.username.min'))
      .max(20, t('validation.username.max')),
    password: Yup.string()
      .required(t('validation.required'))
      .min(6, t('validation.password.min')),
    confirmPassword: Yup.string()
      .required(t('validation.required'))
      .oneOf([Yup.ref('password'), null], t('validation.passwords.match')),
  })

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        setSignupError(null)
        const userData = await authService.signup({
          username: values.username,
          password: values.password,
        })
        // После успешной регистрации - логиним пользователя и редиректим на чат
        dispatch(login(userData))
        navigate('/')
      }
      catch (error) {
        if (error.response?.status === 409) {
          setSignupError(t('signup.error.exists'))
          rollbar.error(t('signup.error.exists'))
        }
        else {
          setSignupError(t('signup.error.general'))
          rollbar.error(t('signup.error.general'))
        }
      }
      finally {
        setSubmitting(false)
      }
    },
  })

  return (
    <Container fluid className="h-100">
      <Row className="justify-content-center align-items-center h-100">
        <Col xs={12} md={6} lg={4}>
          <Card className="p-4 shadow-sm">
            <Card.Body>
              <Card.Title className="mb-4 text-center">{t('signup.title')}</Card.Title>

              {signupError && <Alert variant="danger">{signupError}</Alert>}

              <Form onSubmit={formik.handleSubmit}>
                <Form.Group className="mb-3" controlId="username">
                  <Form.Label className="fw-bold">{t('signup.username')}</Form.Label>
                  <Form.Control
                    type="text"
                    name="username"
                    placeholder={t('signup.usernamePlaceholder')}
                    value={formik.values.username}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={formik.touched.username && !!formik.errors.username}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.username}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3" controlId="password">
                  <Form.Label className="fw-bold">{t('signup.password')}</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    placeholder={t('signup.passwordPlaceholder')}
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={formik.touched.password && !!formik.errors.password}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.password}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3" controlId="confirmPassword">
                  <Form.Label className="fw-bold">{t('signup.confirmPassword')}</Form.Label>
                  <Form.Control
                    type="password"
                    name="confirmPassword"
                    placeholder={t('signup.confirmPasswordPlaceholder')}
                    value={formik.values.confirmPassword}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={formik.touched.confirmPassword && !!formik.errors.confirmPassword}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.confirmPassword}
                  </Form.Control.Feedback>
                </Form.Group>

                <Button
                  variant="primary"
                  type="submit"
                  className="w-100"
                  // disabled={formik.isSubmitting || !formik.isValid}
                  disabled={formik.isSubmitting}
                >
                  {t('signup.submit')}
                </Button>

                <div className="mt-3 text-center">
                  <span>
                    {t('signup.hasAccount')}
                    {' '}
                  </span>
                  <Link to="/login">{t('signup.loginLink')}</Link>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default SignupPage
