import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAPiNoneToken } from '../config/Axios';
import { useSelector } from 'react-redux';
export const checkPhoneValid = email => {
  var filter = /(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/;
  if (!filter.test(email)) {
    return false;
  }
  return true;
};

export const  BASE_URL = "http://192.168.1.8:3000/api";

export const getToken = async () => {
  try {
    const value = await AsyncStorage.getItem('user');
    if (value !== null) {
      const user = JSON.parse(value);
      // console.log('token: ',user.user._id);
      return user.token;
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};  

export const getUserId = async () => {
  try {
    const value = await AsyncStorage.getItem('user');
    if (value !== null) {
      const user = JSON.parse(value);
      // console.log('token: ',user.user._id);
      return user.user._id;
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getUser= async () => {
  try {
    const value = await AsyncStorage.getItem('user');
    if (value !== null) {
      const user = JSON.parse(value);
      // console.log('token: ',user.user._id);
      return user.user;
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};