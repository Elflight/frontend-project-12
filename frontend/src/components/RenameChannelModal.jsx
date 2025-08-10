import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Modal, Button, Form } from 'react-bootstrap'
import { Formik, Field, Form as FormikForm, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import axios from 'axios'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { channelsSelectors, renameChannel } from '../slices/channelsSlice'

const RenameChannelModal = ({ show, handleClose, channelId }) => {
  const dispatch = useDispatch()
  const inputRef = useRef(null)
  const token = useSelector(state => state.auth.token)
  const existingNames = useSelector(channelsSelectors.selectAll).map(ch => ch.name)
  const { t } = useTranslation()

  // Находим текущий канал (может быть null)
  const currentChannel = useSelector(channelsSelectors.selectAll).find(ch => ch.id === channelId)

  useEffect(() => {
    if (show && inputRef.current) {
      inputRef.current.focus()
    }
  }, [show])

  // Возврат, если channelId null или канал не найден
  if (!channelId || !currentChannel) {
    return null
  }

  const validationSchema = Yup.object({
    name: Yup.string()
      .trim()
      .min(3, t('validation.channel'))
      .max(20, t('validation.channel'))
      .notOneOf(existingNames, t('error.channel.exists'))
      .required(t('validation.required')),
  })

  const initialValues = {
    name: currentChannel.name || '',
  }

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      await axios.patch(
        `/api/v1/channels/${channelId}`,
        { name: values.name.trim() },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      dispatch(renameChannel({ id: channelId, changes: { name: values.name.trim() } }))
      toast.success(t('chat.channel.rename.success'))
      handleClose()
    }
    catch {
      toast.error(t('error.channel.rename'))
      setErrors({ name: t('error.channel.rename') })
    }
    finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{t('modal.renameChannel.title')}</Modal.Title>
      </Modal.Header>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize={true} // Важно для обновления initialValues при смене channelId
      >
        {({ isSubmitting }) => (
          <FormikForm>
            <Modal.Body>
              <Form.Group>
                <Form.Label htmlFor="name" className="visually-hidden">{t('chat.channel.placeholder')}</Form.Label>
                <Field
                  id="name"
                  name="name"
                  as={Form.Control}
                  placeholder={t('chat.channel.placeholder')}
                  ref={inputRef}
                  disabled={isSubmitting}
                />
                <Form.Text className="text-danger">
                  <ErrorMessage name="name" />
                </Form.Text>
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose} disabled={isSubmitting}>
                {t('modal.cancel')}
              </Button>
              <Button type="submit" variant="primary" disabled={isSubmitting}>
                {t('modal.renameChannel.submit')}
              </Button>
            </Modal.Footer>
          </FormikForm>
        )}
      </Formik>
    </Modal>
  )
}

export default RenameChannelModal
