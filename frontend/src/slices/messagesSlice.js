import { createSlice, createEntityAdapter, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { t } from 'i18next';
import { handleApiError } from '../utils/errorHandler';
import { cleanProfanity } from '../utils/profanityFilter';
import { removeChannelThunk } from './channelsSlice';

const messagesAdapter = createEntityAdapter();

const initialState = messagesAdapter.getInitialState({
  loading: false,
  error: null,
})

export const fetchMessages = createAsyncThunk(
  'messages/fetchMessages',
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const response = await axios.get('/api/v1/messages', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response);
      return response.data;
    } catch (err) {
      handleApiError(err, t('error.message.noload'));
      return rejectWithValue(err.response?.data || t('error.message.noload'));
    }
  }
);

const messageSlice = createSlice({
    name: 'messages',
    initialState,
    reducers: {
        setAllMessages: (state, action) => {
            const cleanedMessages = action.payload.map(msg => ({
                ...msg,
                body: cleanProfanity(msg.body)
            }));
            messagesAdapter.setAll(state, cleanedMessages);
        },
        addMessage: (state, action) => {
            const cleanedMessage = {
                ...action.payload,
                body: cleanProfanity(action.payload.body)
            };
            messagesAdapter.addOne(state, cleanedMessage);
        },
    },
    extraReducers: (builder) => {
      builder
        .addCase(fetchMessages.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(fetchMessages.fulfilled, (state, action) => {
          state.loading = false;
          const cleanedMessages = action.payload.map(msg => ({
              ...msg,
              body: cleanProfanity(msg.body)
          }));
          messagesAdapter.setAll(state, cleanedMessages);
        })
        .addCase(fetchMessages.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })

        .addCase(removeChannelThunk.fulfilled, (state, action) => {
          const removedChannelId = action.payload;
          const messagesToRemove = Object.values(state.entities)
            .filter((message) => message.channelId === removedChannelId)
            .map((message) => message.id);
          messagesAdapter.removeMany(state, messagesToRemove);
        });
    },
})

//редьюсеры
export const {
    setAllMessages,
    addMessage,
} = messageSlice.actions

export default messageSlice.reducer

//селекторы
export const messagesSelectors = messagesAdapter.getSelectors((state)=>state.messages)

export const selectMessagesByChannelId = (channelId) => (state) =>
  messagesSelectors
    .selectAll(state)
    .filter((message) => message.channelId === channelId);

