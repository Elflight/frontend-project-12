import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../slices/authSlice'
import { useTranslation } from 'react-i18next'

import Container from 'react-bootstrap/Container'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Button from 'react-bootstrap/Button'

const Header = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const isAuthorized = useSelector(state => state.auth.isAuthorized)
  const { t } = useTranslation()

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  return (
    <Navbar bg="white" variant="light" className="shadow-sm ">
      <Container>
        <Navbar.Brand as={Link} to="/">
          {t('header.title')}
        </Navbar.Brand>

        <Nav className="ms-auto">
          {isAuthorized && (
            <Button
              variant="outline-primary"
              onClick={handleLogout}
              size="sm"
            >
              {t('header.logout')}
            </Button>
          )}
        </Nav>
      </Container>
    </Navbar>
  )
}

export default Header
