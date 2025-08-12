import axios from 'axios'
import API from '../apiRoutes.js'

export const authService = {
  async login(credentials) {
    const response = await axios.post(API.LOGIN, credentials)
    return response.data
  },

  async signup(userData) {
    const response = await axios.post(API.SIGNUP, userData)
    return response.data
  },
}

export const channelsService = {
  async fetchChannels(token) {
    const response = await axios.get(API.CHANNELS, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return response.data
  },

  async createChannel(channelData, token) {
    const response = await axios.post(API.CHANNELS, channelData, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return response.data
  },

  async deleteChannel(channelId, token) {
    const response = await axios.delete(`${API.CHANNELS}/${channelId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return response.data
  },

  async renameChannel(channelId, channelData, token) {
    const response = await axios.patch(`${API.CHANNELS}/${channelId}`, channelData, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return response.data
  },
}

export const messagesService = {
  async fetchMessages(token) {
    const response = await axios.get(API.MESSAGES, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return response.data
  },

  async sendMessage(messageData, token) {
    const response = await axios.post(API.MESSAGES, messageData, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return response.data
  },
}
