import React, { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Modal, Button, Form } from 'react-bootstrap'
import { Formik, Field, Form as FormikForm, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import axios from 'axios'
import { addChannel, setCurrentChannelID, channelsSelectors } from '../slices/channelsSlice'

const AddChannelModal = ({ show, handleClose }) => {
    const dispatch = useDispatch()
    const inputRef = useRef(null)
    const token = useSelector((state) => state.auth.token)
    const existingNames = useSelector(channelsSelectors.selectAll).map((ch) => ch.name)

    useEffect(() => {
        if (show && inputRef.current) {
            inputRef.current.focus()
        }
    }, [show])

    const validationSchema = Yup.object({
        name: Yup.string()
        .trim()
        .min(3, 'От 3 до 20 символов')
        .max(20, 'От 3 до 20 символов')
        .notOneOf(existingNames, 'Канал с таким именем уже существует')
        .required('Обязательное поле'),
    })

    const handleSubmit = async (values, { setSubmitting, setErrors }) => {
        try {
            const response = await axios.post(
                '/api/v1/channels',
                { name: values.name.trim() },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            )
            dispatch(addChannel(response.data))
            dispatch(setCurrentChannelID(response.data.id))
            handleClose()
        } catch {
            setErrors({ name: 'Ошибка при создании канала' })
        } finally {
            setSubmitting(false)
        }
    }

    return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Новый канал</Modal.Title>
      </Modal.Header>
      <Formik
        initialValues={{ name: '' }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <FormikForm>
            <Modal.Body>
              <Form.Group>
                <Field
                  name="name"
                  as={Form.Control}
                  placeholder="Имя канала"
                  innerRef={inputRef}
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
                Создать
              </Button>
            </Modal.Footer>
          </FormikForm>
        )}
      </Formik>
    </Modal>
  )
}

export default AddChannelModal