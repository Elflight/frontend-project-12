import React from 'react'
import { Modal, Button } from 'react-bootstrap'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { removeChannelThunk } from '../slices/channelsSlice'

const RemoveChannelModal = ({ show, handleClose, channelId }) => {
  const dispatch = useDispatch()
  const { t } = useTranslation()

  const handleRemove = async () => {
    await dispatch(removeChannelThunk(channelId))
    toast.success(t('chat.channel.delete.success'))
    handleClose()
  }

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{t('modal.removeChannel.title')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{t('modal.removeChannel.body')}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          {t('modal.cancel')}
        </Button>
        <Button variant="danger" onClick={handleRemove}>
          {t('modal.removeChannel.confirm')}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default RemoveChannelModal
