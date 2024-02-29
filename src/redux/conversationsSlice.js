import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import axios from 'axios';
import {BASE_URL} from '../utils';
import {getToken} from '../utils';
import {create} from 'react-test-renderer';

export const getAllConversations = createAsyncThunk(
  'conversation/getAllconversations',
  async apiUrl => {
    try {
      const token = await getToken();
      const result = await axios.get(`${BASE_URL}/conversation/getConversations/${apiUrl}`, {
        headers: {
          'auth-token': `${token}`,
        },
      });
      return result.data;
    } catch (error) {
      console.log(error);
    }
  },
);

export const selectedConversation = createAsyncThunk(
  'conversation/selectedConersation',
  async apiUrl => {
    try {
      const token = await getToken();
      const result = await axios.get(`${BASE_URL}` + apiUrl, {
        headers: {
          'auth-token': `${token}`,
        },
      });
      return result.data;
    } catch (error) {
      console.log(error);
    }
  },
);

export const getRecipient = createAsyncThunk(
  'conversation/getRecipient',
  async apiUrl => {
    try {
      const token = await getToken();
      const result = await axios.get(`${BASE_URL}` + apiUrl, {
        headers: {
          'auth-token': `${token}`,
        },
      });
      return result.data;
    } catch (error) {
      console.log(error);
    }
  },
);

const conversationsSlice = createSlice({
  name: 'conversationsSlice',
  initialState: {
    allConversation: [],
    selectedConversation: null,
    userRecipient: null,
  },
  reducers: {
    selectConversation: (state, action) => {
      state.selectedConversation = action.payload;
    },
    handleNewConversation: (state, action) => {
      state.allConversation = [...state.allConversation, action.payload];
    },
  },
  extraReducers: builder => {
    builder
      .addCase(getAllConversations.fulfilled, (state, action) => {
        state.allConversation = action.payload;
      })
      .addCase(selectedConversation.fulfilled, (state, action) => {
        state.selectedConversation = action.payload;
      })
      .addCase(getRecipient.fulfilled, (state, action) => {
        state.userRecipient = action.payload;
      });
  },
});
const {reducer, actions} = conversationsSlice;
export const {selectConversation, handleNewConversation} = actions;
export default reducer;
