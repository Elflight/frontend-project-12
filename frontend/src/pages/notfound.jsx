import { useTranslation } from 'react-i18next'

const NotfoundPage = () => {
  const { t } = useTranslation();

  return (
    <>
    <h2>404 page not found</h2>
    <p>{t('page.notFound')}</p>
    <p>{t('page.notFound.text')}</p>
    <p><a href="/">{t('page.notFound.link')}</a></p>
    </>
  )
}

export default NotfoundPage