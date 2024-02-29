import {configureStore} from '@reduxjs/toolkit';
import userReducer from './userSlice';
import conversationReducer from './conversationsSlice';
import messageReducer from './messageSlice';
const rootReducer = {
  userReducer: userReducer,
  conversationReducer: conversationReducer,
  messageReducer: messageReducer,
};

const store = configureStore({
  reducer: rootReducer,
});

export default store;
