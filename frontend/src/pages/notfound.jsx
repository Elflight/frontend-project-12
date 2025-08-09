import { useTranslation } from 'react-i18next'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'

const NotfoundPage = () => {
  const { t } = useTranslation()

  return (
    <Container fluid className="h-100">
      <Row className="justify-content-center align-items-center h-100">
        <Col xs={12} md={6} lg={4}>
          <Card className="p-4 shadow-sm text-center">
            <Card.Body>
              <Card.Title className="mb-4 text-center">404 page not found</Card.Title>
              <p>{t('page.notFound')}</p>
              <p>{t('page.notFound.text')}</p>
              <p><a href="/">{t('page.notFound.link')}</a></p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default NotfoundPage
