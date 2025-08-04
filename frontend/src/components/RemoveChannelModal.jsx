import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { removeChannelThunk } from '../slices/channelsSlice';

const RemoveChannelModal = ({ show, handleClose, channelId }) => {
  const dispatch = useDispatch();

  const handleRemove = async () => {
    await dispatch(removeChannelThunk(channelId));
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Удалить канал?</Modal.Title>
      </Modal.Header>
      <Modal.Body>Вы уверены, что хотите удалить этот канал?</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Отмена
        </Button>
        <Button variant="danger" onClick={handleRemove}>
          Удалить
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default RemoveChannelModal;
