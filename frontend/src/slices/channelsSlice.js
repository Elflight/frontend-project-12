import { createSlice, createEntityAdapter, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { fetchMessages } from './messagesSlice';

const channelAdapter = createEntityAdapter();

const initialState = channelAdapter.getInitialState({
    currentChannelId: null,
    loading: false,
    error: null,
})

export const fetchChannels = createAsyncThunk(
  'channels/fetchChannels',
  async (_, { dispatch, getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const response = await axios.get('/api/v1/channels', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

        // После получения каналов — загружаем сообщения
        dispatch(fetchMessages());

      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Failed to fetch channels');
    }
  }
);

const channelSlice = createSlice({
    name: 'channels',
    initialState,
    reducers: {
        setAllChannels: channelAdapter.setAll,
        addChannel: channelAdapter.addOne,
        removeChannel: channelAdapter.removeOne,
        renameChannel: channelAdapter.updateOne,
        setCurrentChannelID(state, action) {
            state.currentChannelId = action.payload
        }
    },
    extraReducers: (builder) => {
    builder
      .addCase(fetchChannels.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChannels.fulfilled, (state, action) => {
        state.loading = false;
        channelAdapter.setAll(state, action.payload);
        // по умолчанию ставим активным первый канал
        if (!state.currentChannelId && action.payload.length > 0) {
          state.currentChannelId = action.payload[0].id;
        }
      })
      .addCase(fetchChannels.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
})

//редьюсеры
export const {
    setAllChannels,
    addChannel,
    removeChannel,
    renameChannel,
    setCurrentChannelID
} = channelSlice.actions

export default channelSlice.reducer

//селекторы
export const channelsSelectors = channelAdapter.getSelectors((state)=>state.channels)

