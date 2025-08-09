import React, { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Modal, Button, Form } from 'react-bootstrap'
import { Formik, Field, Form as FormikForm, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import axios from 'axios'
import { useTranslation } from 'react-i18next'
import { addChannel, setCurrentChannelID, channelsSelectors } from '../slices/channelsSlice'

const AddChannelModal = ({ show, handleClose }) => {
    const dispatch = useDispatch()
    const inputRef = useRef(null)
    const token = useSelector((state) => state.auth.token)
    const existingNames = useSelector(channelsSelectors.selectAll).map((ch) => ch.name)
    const { t } = useTranslation();

    useEffect(() => {
        if (show && inputRef.current) {
            inputRef.current.focus()
        }
    }, [show])

    const validationSchema = Yup.object({
        name: Yup.string()
        .trim()
        .min(3, t('validation.channel'))
        .max(20, t('validation.channel'))
        .notOneOf(existingNames, t('error.channel.exists'))
        .required(t('validation.required')),
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
            setErrors({ name: t('error.channel.create') })
        } finally {
            setSubmitting(false)
        }
    }

    return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{t('modal.addChannel.title')}</Modal.Title>
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
                {t('chat.channel.submit')}
              </Button>
            </Modal.Footer>
          </FormikForm>
        )}
      </Formik>
    </Modal>
  )
}

export default AddChannelModal