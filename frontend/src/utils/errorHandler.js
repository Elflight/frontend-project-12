import { toast } from 'react-toastify'
import i18n from '../i18n'

export const handleApiError = (error, defaultMessage) => {
  // Оффлайн ошибки
  if (!error.response) {
    if (!navigator.onLine) {
      toast.error(i18n.t('error.network.offline'))
    } else {
      toast.error(i18n.t('error.network.connection'))
    }
    return
  }

  // HTTP ошибки
  switch (error.response.status) {
    case 401:
      toast.error(i18n.t('error.auth.unauthorized'))
      break
    case 403:
      toast.error(i18n.t('error.auth.forbidden'))
      break
    case 404:
      toast.error(i18n.t('error.api.notFound'))
      break
    case 500:
      toast.error(i18n.t('error.api.server'))
      break
    default:
      toast.error(defaultMessage || i18n.t('error.api.general'))
  }
}

// Для сокетов
export const handleSocketError = () => {
  toast.error(i18n.t('error.socket.connection'))
}
