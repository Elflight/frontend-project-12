import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

const resources = {
  ru: {
    translation: {
      // Навигация и хедер
      'header.title': 'Hexlet Chat',
      'header.logout': 'Выйти',

      // Формы авторизации
      'login.title': 'Войти',
      'login.username': 'Ваш ник',
      'login.usernamePlaceholder': 'Введите имя',
      'login.password': 'Пароль',
      'login.passwordPlaceholder': 'Введите пароль',
      'login.submit': 'Войти',
      'login.noAccount': 'Нет аккаунта?',
      'login.signupLink': 'Регистрация',
      'login.error': 'Неверные имя пользователя или пароль',

      // Формы регистрации
      'signup.title': 'Регистрация',
      'signup.username': 'Имя пользователя',
      'signup.password': 'Пароль',
      'signup.confirmPassword': 'Подтвердите пароль',
      'signup.usernamePlaceholder': 'Введите имя пользователя',
      'signup.passwordPlaceholder': 'Введите пароль',
      'signup.confirmPasswordPlaceholder': 'Повторно введите пароль',
      'signup.submit': 'Зарегистрироваться',
      'signup.hasAccount': 'Уже есть аккаунт?',
      'signup.loginLink': 'Войти',
      'signup.error.exists': 'Такой пользователь уже существует',
      'signup.error.general': 'Ошибка при регистрации. Попробуйте еще раз.',

      // Валидация форм
      'validation.required': 'Обязательное поле',
      'validation.username.min': 'Имя пользователя должно быть не менее 3 символов',
      'validation.username.max': 'Имя пользователя должно быть не более 20 символов',
      'validation.password.min': 'Не менее 6 символов',
      'validation.passwords.match': 'Пароли должны совпадать',
      'validation.channel': 'От 3 до 20 символов',

      // Чат
      'chat.channels': 'Каналы',
      'chat.addChannel': '+',
      'chat.channel.actions': 'Управление каналом',
      'chat.channel.rename': 'Переименовать',
      'chat.channel.remove': 'Удалить',
      'chat.messages.count_zero': 'Нет сообщений',
      'chat.messages.count_one': '{{count}} сообщение',
      'chat.messages.count_few': '{{count}} сообщения',
      'chat.messages.count_many': '{{count}} сообщений',
      'chat.messages.count_other': '{{count}} сообщений',
      'chat.message.placeholder': 'Введите сообщение...',
      'chat.message.send': '➤',
      'chat.channel.placeholder': 'Имя канала',
      'chat.channel.cancel': 'Отмена',
      'chat.channel.submit': 'Создать',
      'chat.channel.create.success': 'Канал создан',
      'chat.channel.delete.success': 'Канал удалён',
      'chat.channel.rename.success': 'Канал переименован',

      // Модальные окна
      'modal.addChannel.title': 'Новый канал',
      'modal.removeChannel.title': 'Удалить канал?',
      'modal.removeChannel.body': 'Вы уверены, что хотите удалить этот канал?',
      'modal.removeChannel.confirm': 'Удалить',
      'modal.renameChannel.title': 'Переименование канала',
      'modal.renameChannel.submit': 'Применить',
      'modal.cancel': 'Отмена',

      // Ошибки
      'error.channel.noload': 'Ошибка загрузки каналов',
      'error.channel.exists': 'Канал с таким именем уже существует',
      'error.channel.create': 'Ошибка при создании канала',
      'error.channel.remove': 'Ошибка при удалении канала',
      'error.channel.rename': 'Ошибка при переименовании канала',
      'error.message.noload': 'Ошибка загрузки сообщений',
      'error.message.send': 'Ошибка отправки сообщения',

      // Страницы
      'page.notFound': 'Страница не найдена',
      'page.notFound.text': 'Вы можете перейти на главную страницу',
      'page.notFound.link': 'На главную',

      //Сетевые ошибки
      'error.network.offline': 'Нет подключения к интернету',
      'error.network.connection': 'Ошибка подключения к серверу',
      'error.auth.unauthorized': 'Ошибка авторизации. Пожалуйста, войдите снова',
      'error.auth.forbidden': 'Доступ запрещен',
      'error.api.notFound': 'Ресурс не найден',
      'error.api.server': 'Ошибка сервера. Попробуйте позже',
      'error.api.general': 'Произошла ошибка. Попробуйте позже',
      'error.socket.connection': 'Ошибка соединения',
      'error.channel.load': 'Ошибка загрузки каналов',
      'error.messages.load': 'Ошибка загрузки сообщений',
    },
  },
}

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'ru',
    fallbackLng: 'ru',
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  })

export default i18n
