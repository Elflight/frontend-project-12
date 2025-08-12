import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useFormik } from 'formik'
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

const LoginPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [authError, setAuthError] = useState(null)
  const { t } = useTranslation()
  const rollbar = useRollbar()

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const userData = await authService.login(values)
        dispatch(login(userData))
        navigate('/')
      }
      catch {
        setAuthError(t('login.error'))
        rollbar.error(t('login.error'))
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
              <Card.Title className="mb-4 text-center">{t('login.title')}</Card.Title>

              {authError && <Alert variant="danger">{authError}</Alert>}

              <Form onSubmit={formik.handleSubmit}>
                <Form.Group className="mb-3" controlId="username">
                  <Form.Label className="fw-bold">{t('login.username')}</Form.Label>
                  <Form.Control
                    type="text"
                    name="username"
                    placeholder={t('login.usernamePlaceholder')}
                    value={formik.values.username}
                    onChange={formik.handleChange}
                    isInvalid={!!authError}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="password">
                  <Form.Label className="fw-bold">{t('login.password')}</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    placeholder={t('login.passwordPlaceholder')}
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    isInvalid={!!authError}
                    required
                  />
                </Form.Group>

                <Button
                  variant="primary"
                  type="submit"
                  className="w-100"
                  disabled={formik.isSubmitting}
                >
                  {t('login.submit')}
                </Button>

                <div className="mt-3 text-center">
                  <span>
                    {t('login.noAccount')}
                    {' '}
                  </span>
                  <Link to="/signup">{t('login.signupLink')}</Link>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default LoginPage
