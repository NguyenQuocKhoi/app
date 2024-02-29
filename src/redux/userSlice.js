import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import axios from 'axios';
import { useSelector} from 'react-redux';
import { getAPiWithToken } from '../config/Axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../utils';
    
const getToken = async () => {
  try {
    const value = await AsyncStorage.getItem('user');
    if (value !== null) {
      const user = JSON.parse(value);
      // console.log('token: ',user.token);
      return user.token;
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getBlocks = createAsyncThunk(
  "user/getBlocks",
  async (urlApi)=>{
    try{
      const token = await getToken();
      const pendingRequests = await axios.get(`${BASE_URL}`+urlApi,{
        headers : {
          "auth-token":`${token}`
        },
      });
      return pendingRequests.data.blocked;
    }catch(error){
      console.log(error);
    }
  }
)

export const getPenddingRequests = createAsyncThunk(
  "user/getPenddingRequests",
  async (urlApi) => {
    try {
      const token = await getToken(); 
      // console.log('token2',token);
      const pendingRequests = await axios.get(`${BASE_URL}`+ urlApi, {
        headers: {
          "auth-token": `${token}` 
        },
      });
      return pendingRequests.data.pendingRequests;
    } catch (error) {
      console.log(1);
      console.log(error);
      throw error; 
    }
  }
);

export const getContacts = createAsyncThunk(
  "user/getContacts",
  async (urlApi) => {
    try {
      const token = await getToken(); 
      // console.log('token2',token);
      const pendingRequests = await axios.get(`${BASE_URL}/users/${urlApi}/contacts`, {
        headers: {
          "auth-token": `${token}` 
        },
      });
      // console.log(2);
      return pendingRequests.data;
    } catch (error) {
      console.log('useslice');
      console.log(error);
      throw error; 
    }
  }
);


const userSlice = createSlice({
  name: "userSlice",
  initialState: {
    pendingRequests: [],
    contacts: [],
    blocked:[],
    usersOnline:{}
  },
  reducers: {
    handleGetUsersOnline:(state, action)=>{
      state.usersOnline = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPenddingRequests.fulfilled, (state, action) => {
        state.pendingRequests = action.payload;
      })
      .addCase(getContacts.fulfilled, (state, action) => {
        state.contacts = action.payload;
      })
      .addCase(getBlocks.fulfilled, (state, action) => {
        state.blocked = action.payload;
      });
  },
});
const { reducer, actions } = userSlice;
export const {handleGetUsersOnline} = actions
export default reducer;