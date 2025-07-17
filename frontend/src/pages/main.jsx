import React from 'react'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchChannels } from '../slices/channelsSlice'
import { channelsSelectors } from '../slices/channelsSlice';
import { messagesSelectors } from '../slices/messagesSlice';
import { setCurrentChannelID } from '../slices/channelsSlice';
import { Container, Row, Col, Button, Card, ListGroup, Form } from 'react-bootstrap';


const MainPage = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchChannels())
  }, [dispatch]);

  const channels = useSelector(channelsSelectors.selectAll);
  const currentChannelId = useSelector((state) => state.channels.currentChannelId);
  const currentChannel = channels.find((c) => c.id === currentChannelId);

  const messages = useSelector(messagesSelectors.selectAll)
    .filter((m) => m.channelId === currentChannelId);


    return (
    <Container fluid className="h-100 p-3">
      <Row className="h-100">
        {/* Левая колонка — список каналов */}
        <Col xs={3} className="border-end">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <b>Каналы</b>
            <Button variant="outline-primary" size="sm">+</Button>
          </div>
          <ListGroup>
            {channels.map((channel) => (
              <ListGroup.Item
                key={channel.id}
                active={channel.id === currentChannelId}
                action
                onClick={() => dispatch(setCurrentChannelID(channel.id))}
              >
                #{channel.name}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>

        {/* Правая колонка — чат и форма */}
        <Col xs={9} className="d-flex flex-column h-100">
          <div className="mb-3">
            <h5>#{currentChannel?.name}</h5>
            <span className="text-muted">{messages.length} сообщений</span>
          </div>

          <div className="flex-grow-1 overflow-auto mb-3">
            {messages.map((msg) => (
              <div key={msg.id} className="mb-2">
                <b>{msg.username}</b>: {msg.body}
              </div>
            ))}
          </div>

          <Form>
            <Form.Group className="d-flex">
              <Form.Control
                type="text"
                placeholder="Введите сообщение..."
              />
              <Button type="submit" variant="primary" className="ms-2">
                &#10148;
              </Button>
            </Form.Group>
          </Form>
        </Col>
      </Row>
    </Container>
  )
}

export default MainPage