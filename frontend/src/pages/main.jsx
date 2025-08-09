import React from 'react'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchChannels } from '../slices/channelsSlice'
import { channelsSelectors } from '../slices/channelsSlice'
import { messagesSelectors, addMessage } from '../slices/messagesSlice'
import { setCurrentChannelID, selectCurrentChannel } from '../slices/channelsSlice'
import { Container, Row, Col, Button, Card, ListGroup, Form, Dropdown } from 'react-bootstrap'
import axios from 'axios'
import socket from '../socket'
import { useTranslation } from 'react-i18next'

import AddChannelModal from '../components/AddChannelModal'
import RemoveChannelModal from '../components/RemoveChannelModal'
import RenameChannelModal from '../components/RenameChannelModal'


const MainPage = () => {
  const dispatch = useDispatch()
  const { t } = useTranslation();

  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)

  const [showRemoveModal, setShowRemoveModal] = useState(false)
  const [channelToRemove, setChannelToRemove] = useState(null)

  const [showRenameModal, setShowRenameModal] = useState(false)
  const [channelToRename, setChannelToRename] = useState(null)

  const openRemoveModal = (id) => {
    setChannelToRemove(id);
    setShowRemoveModal(true);
  };

  const closeRemoveModal = () => {
    setChannelToRemove(null);
    setShowRemoveModal(false);
  };

  const openRenameModal = (id) => {
    setChannelToRename(id);
    setShowRenameModal(true);
  };

  const closeRenameModal = () => {
    setChannelToRename(null);
    setShowRenameModal(false);
  };

  useEffect(() => {
    dispatch(fetchChannels())
  }, [dispatch]);

  useEffect(() => {
    socket.on('newMessage', (msg) => {
      dispatch(addMessage(msg));
    });

    return () => {
      socket.off('newMessage'); // важно очищать
    };
  }, [dispatch]);

  const channels = useSelector(channelsSelectors.selectAll);
  const currentChannel = useSelector(selectCurrentChannel);
  const currentChannelId = useSelector((state) => state.channels.currentChannelId);
  
  const messages = useSelector(messagesSelectors.selectAll)
  .filter((m) => m.channelId === currentChannelId);
  
  const token = useSelector((state) => state.auth.token);
  const username = useSelector((state) => state.auth.username);


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const newMessage = {
      body: message,
      channelId: currentChannelId,
      username,
    };

    try {
      setSending(true);
      await axios.post('/api/v1/messages', newMessage, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMessage('');
    } catch (err) {
      console.error(t('error.message.send'), err);
    } finally {
      setSending(false);
    }
  };


    return (
    <>
    <Container fluid className="h-100 p-3">
      <Row className="h-100">
        {/* Левая колонка — список каналов */}
        <Col xs={3} className="border-end">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <b>{t('chat.channels')}</b>
            <Button variant="outline-primary" size="sm" onClick={() => setShowAddModal(true)}>{t('chat.addChannel')}</Button>
          </div>
          
          <ListGroup key={`channels-list-${currentChannelId}`}>
            {channels.map((channel) => {
              // console.log(`Rendering channel:`, channel.name, 'id:', channel.id, '=== current:', currentChannelId, channel.id === currentChannelId);
              return (
              <ListGroup.Item
                className="d-flex justify-content-between align-items-center text-break"
                key={channel.id}
                active={Number(channel.id) === Number(currentChannelId)}
                action
                onClick={() => dispatch(setCurrentChannelID(channel.id))}
              >
                <span className="me-2">#{channel.name}</span>
                  {channel.removable && (
                    <Dropdown onClick={(e) => e.stopPropagation()} align="end">
                      <Dropdown.Toggle
                        as="span"
                        variant="light"
                        size="sm"
                        className="p-0 border-0 bg-transparent"
                        id={`dropdown-${channel.id}`}
                      >
                        <span className="visually-hidden">{t('chat.channel.actions')}</span>
                      </Dropdown.Toggle>

                      <Dropdown.Menu>
                        <Dropdown.Item onClick={() => openRenameModal(channel.id)}>
                          {t('chat.channel.rename')}
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => openRemoveModal(channel.id)}>
                          {t('chat.channel.remove')}
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  )}
              </ListGroup.Item>
              )
            })}
          </ListGroup>
        </Col>

        {/* Правая колонка — чат и форма */}
        <Col xs={9} className="d-flex flex-column h-100">
          <div className="mb-3">
            <h5>#{currentChannel?.name}</h5>
            <span className="text-muted">{t('chat.messages.count', { count: messages.length })}</span>
          </div>

          <div className="flex-grow-1 overflow-auto mb-3">
            {messages.map((msg) => (
              <div key={msg.id} className="mb-2 text-break">
                <b>{msg.username}</b>: {msg.body}
              </div>
            ))}
          </div>

          <Form onSubmit={handleSubmit}>
            <Form.Group className="d-flex">
              <Form.Control
                type="text"
                placeholder={t('chat.message.placeholder')}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={sending}
              />
              <Button type="submit" variant="primary" className="ms-2" disabled={sending}>
                {t('chat.message.send')}
              </Button>
            </Form.Group>
          </Form>
        </Col>
      </Row>
    </Container>
    <AddChannelModal show={showAddModal} handleClose={() => setShowAddModal(false)} />
    <RemoveChannelModal show={showRemoveModal} handleClose={closeRemoveModal} channelId={channelToRemove}/>
    <RenameChannelModal show={showRenameModal} handleClose={closeRenameModal} channelId={channelToRename}/>
    </>
  )
}

export default MainPage