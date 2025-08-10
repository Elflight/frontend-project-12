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
import { handleSocketError } from '../utils/errorHandler'

import AddChannelModal from '../components/AddChannelModal'
import RemoveChannelModal from '../components/RemoveChannelModal'
import RenameChannelModal from '../components/RenameChannelModal'

const MainPage = () => {
  const dispatch = useDispatch()
  const { t } = useTranslation()

  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)

  const [showRemoveModal, setShowRemoveModal] = useState(false)
  const [channelToRemove, setChannelToRemove] = useState(null)

  const [showRenameModal, setShowRenameModal] = useState(false)
  const [channelToRename, setChannelToRename] = useState(null)

  const openRemoveModal = (id) => {
    setChannelToRemove(id)
    setShowRemoveModal(true)
  }

  const closeRemoveModal = () => {
    setChannelToRemove(null)
    setShowRemoveModal(false)
  }

  const openRenameModal = (id) => {
    setChannelToRename(id)
    setShowRenameModal(true)
  }

  const closeRenameModal = () => {
    setChannelToRename(null)
    setShowRenameModal(false)
  }

  useEffect(() => {
    dispatch(fetchChannels())
  }, [dispatch])

  useEffect(() => {
    socket.on('newMessage', (msg) => {
      dispatch(addMessage(msg))
    })

    socket.on('connect_error', (error) => {
      handleSocketError(error)
    })

    socket.on('disconnect', (reason) => {
      if (reason === 'io server disconnect') {
        // Сервер закрыл соединение
        handleSocketError(t('socket.disconnected'))
      } else {
        // Попытка переподключения
        handleSocketError(t('socket.reconnecting'))
      }
    })

    return () => {
      socket.off('newMessage') // важно очищать
      socket.off('connect_error')
      socket.off('disconnect')
    }
  }, [dispatch])

  const channels = useSelector(channelsSelectors.selectAll)
  const currentChannel = useSelector(selectCurrentChannel)
  const currentChannelId = useSelector((state) => state.channels.currentChannelId)

  const messages = useSelector(messagesSelectors.selectAll)
    .filter((m) => m.channelId === currentChannelId)

  const token = useSelector((state) => state.auth.token)
  const username = useSelector((state) => state.auth.username)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!message.trim()) return

    const newMessage = {
      body: message,
      channelId: currentChannelId,
      username,
    }

    try {
      setSending(true)
      await axios.post('/api/v1/messages', newMessage, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      setMessage('')
    } catch (err) {
      console.error(t('error.message.send'), err)
    } finally {
      setSending(false)
    }
  }

  return (
    <>
      <Container className="h-100 my-4 overflow-hidden rounded shadow">
        <Row className="h-100 bg-white flex-md-row">
          {/* Левая колонка — список каналов */}
          <Col
            xs={4}
            md={2}
            className="border-end px-0 bg-light flex-column h-100 d-flex"
          >
            <div className="d-flex mt-1 justify-content-between mb-2 ps-4 pe-2 p-4">
              <b>{t('chat.channels')}</b>
              <Button variant="outline-primary" size="sm" onClick={() => setShowAddModal(true)}>{t('chat.addChannel')}</Button>
            </div>

            <ListGroup key={`channels-list-${currentChannelId}`} className='nav flex-column nav-pills nav-fill px-2 mb-3 overflow-auto h-100 d-block'>
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
                          split
                          variant="light"
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
          <Col className="p-0 h-100">
            <div className="d-flex flex-column h-100">
              <div className="bg-light mb-4 p-3 shadow-sm small">
                <h5 className='m-0'>#{currentChannel?.name}</h5>
                <span className="text-muted">{t('chat.messages.count', { count: messages.length })}</span>
              </div>

              <div className="chat-messages overflow-auto px-5">
                {messages.map((msg) => (
                  <div key={msg.id} className="mb-2 text-break">
                    <b>{msg.username}</b>: {msg.body}
                  </div>
                ))}
              </div>

              <div className='mt-auto px-5 py-3'>
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="d-flex">
                    <Form.Control
                      type="text"
                      placeholder={t('chat.message.placeholder')}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      disabled={sending}
                      aria-label={t('chat.message.aria')}
                    />
                    <Button type="submit" variant="primary" className="ms-2" disabled={sending}>
                      {t('chat.message.send')}
                    </Button>
                  </Form.Group>
                </Form>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
      <AddChannelModal show={showAddModal} handleClose={() => setShowAddModal(false)} />
      <RemoveChannelModal show={showRemoveModal} handleClose={closeRemoveModal} channelId={channelToRemove} />
      <RenameChannelModal show={showRenameModal} handleClose={closeRenameModal} channelId={channelToRename} />
    </>
  )
}

export default MainPage
