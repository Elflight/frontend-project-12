import { createSlice, createEntityAdapter, createAsyncThunk } from '@reduxjs/toolkit'
import { t } from 'i18next'
import { handleApiError } from '../utils/errorHandler'
import { cleanProfanity } from '../utils/profanityFilter'
import { fetchMessages } from './messagesSlice'
import { channelsService } from '../utils/apiClient'

const channelAdapter = createEntityAdapter()

const initialState = channelAdapter.getInitialState({
  currentChannelId: null,
  loading: false,
  error: null,
})

export const fetchChannels = createAsyncThunk(
  'channels/fetchChannels',
  async (_, { dispatch, getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token
      const channelsData = channelsService.fetchChannels(token)

      // После получения каналов — загружаем сообщения
      dispatch(fetchMessages())

      return channelsData
    }
    catch (err) {
      handleApiError(err, t('error.channel.load'))
      return rejectWithValue(err.response?.data || t('error.channel.noload'))
    }
  },
)

export const removeChannelThunk = createAsyncThunk(
  'channels/removeChannelThunk',
  async (channelId, { getState, rejectWithValue }) => {
    const token = getState().auth.token

    try {
      await channelsService.deleteChannel(channelId, token)

      return channelId
    }
    catch (err) {
      handleApiError(err, t('error.channel.remove'))
      return rejectWithValue(err.response?.data || t('error.channel.remove'))
    }
  },
)

const channelSlice = createSlice({
  name: 'channels',
  initialState,
  reducers: {
    setAllChannels: (state, action) => {
      const cleanedChannels = action.payload.map(channel => ({
        ...channel,
        name: cleanProfanity(channel.name),
      }))
      channelAdapter.setAll(state, cleanedChannels)
    },
    addChannel: (state, action) => {
      const cleanedChannel = {
        ...action.payload,
        name: cleanProfanity(action.payload.name),
      }
      channelAdapter.addOne(state, cleanedChannel)
    },
    removeChannel: channelAdapter.removeOne,
    renameChannel: (state, action) => {
      const cleanedUpdate = {
        ...action.payload,
        changes: {
          ...action.payload.changes,
          name: cleanProfanity(action.payload.changes.name),
        },
      }
      channelAdapter.updateOne(state, cleanedUpdate)
    },
    setCurrentChannelID(state, action) {
      state.currentChannelId = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChannels.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchChannels.fulfilled, (state, action) => {
        state.loading = false
        channelAdapter.setAll(state, action.payload)
        // по умолчанию ставим активным первый канал
        if (!state.currentChannelId && action.payload.length > 0) {
          state.currentChannelId = action.payload[0].id
        }
      })
      .addCase(fetchChannels.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(removeChannelThunk.fulfilled, (state, action) => {
        const removedId = action.payload
        channelAdapter.removeOne(state, removedId)

        if (state.currentChannelId === removedId) {
          state.currentChannelId = 1
        }
      })
  },
})

// редьюсеры
export const {
  setAllChannels,
  addChannel,
  removeChannel,
  renameChannel,
  setCurrentChannelID,
} = channelSlice.actions

export default channelSlice.reducer

// селекторы
export const channelsSelectors = channelAdapter.getSelectors(state => state.channels)

export const selectCurrentChannel = (state) => {
  const id = state.channels.currentChannelId
  return channelsSelectors.selectById(state, id) || null
}
