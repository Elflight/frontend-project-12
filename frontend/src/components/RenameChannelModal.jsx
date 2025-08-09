import React, { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Modal, Button, Form } from 'react-bootstrap'
import { Formik, Field, Form as FormikForm, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import axios from 'axios'
import {channelsSelectors, renameChannel } from '../slices/channelsSlice'

const RenameChannelModal = ({ show, handleClose, channelId }) => {
    const dispatch = useDispatch()
    const inputRef = useRef(null)
    const token = useSelector((state) => state.auth.token)
    const existingNames = useSelector(channelsSelectors.selectAll).map((ch) => ch.name)

     // Находим текущий канал (может быть null)
    const currentChannel = useSelector(channelsSelectors.selectAll).find((ch) => ch.id === channelId)

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
        .min(3, 'От 3 до 20 символов')
        .max(20, 'От 3 до 20 символов')
        .notOneOf(existingNames, 'Канал с таким именем уже существует')
        .required('Обязательное поле'),
    })

    const initialValues = {
        name: currentChannel.name || ''
    }

    const handleSubmit = async (values, { setSubmitting, setErrors }) => {
        try {
            await axios.patch(
                `/api/v1/channels/${channelId}`,
                { name: values.name.trim() },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            )
            dispatch(renameChannel({ id: channelId, changes: { name: values.name.trim() } }))
            handleClose()
        } catch {
            setErrors({ name: 'Ошибка при переименовании канала' })
        } finally {
            setSubmitting(false)
        }
    }

    return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Переименование канала</Modal.Title>
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
                <Field
                  name="name"
                  as={Form.Control}
                  placeholder="Имя канала"
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
                Отмена
              </Button>
              <Button type="submit" variant="primary" disabled={isSubmitting}>
                Применить
              </Button>
            </Modal.Footer>
          </FormikForm>
        )}
      </Formik>
    </Modal>
  )
}

export default RenameChannelModal