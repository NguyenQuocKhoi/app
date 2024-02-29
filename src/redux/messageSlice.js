import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { BASE_URL } from "../utils";
import { getToken } from "../utils";
import axios from "axios";


export const getCurrentMessage = createAsyncThunk(
    "message/getCurrentMessage",
    async (apiUrl) => {
      try {
        const token = await getToken();
        const result = await axios.get(`${BASE_URL}/conversation/getMessages/${apiUrl}`,{
            headers:{
                "auth-token":`${token}`
            }
        })
        return result.data;
      } catch (error) {
        console.log(error);
      }
    }
  );
  export const sendMessage = createAsyncThunk(
    "message/sendMessage",
    async (apiUrl) => {
      try {
        const token = await getToken();
        const result = await axios.post(`${BASE_URL}/conversation/sendMessage`, apiUrl,{
            headers:{
                "auth-token":`${token}`
            }
        })
        return result.data;
      } catch (error) {
        console.log(error);
      }
    }
  );
  
  const messageSlice = createSlice({
    name: "messageSlice",
    initialState: {
      newMessage: [],
      currentMessage: [],
    },
    reducers: {
      handleSetCurrentMessage:(state,action)=>{
        state.currentMessage=[...state.currentMessage, action.payload]
      }
    },
    extraReducers: (builder) => {
      builder
        .addCase(getCurrentMessage.fulfilled, (state, action) => {
          state.currentMessage = action.payload;
        })
        .addCase(sendMessage.fulfilled, (state, action) => {
          state.newMessage = action.payload;
          state.currentMessage = [...state.currentMessage, action.payload];
        });
    },
  });
  const { reducer, actions } = messageSlice;
  export const {handleSetCurrentMessage} = actions
  export default reducer;
  