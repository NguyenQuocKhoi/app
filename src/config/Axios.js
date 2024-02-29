import axios from 'axios';
import {getUserStorage} from '../utils';
import { useSelector } from 'react-redux';
var api = axios.create({
  baseURL: 'http://192.168.1.8:3000/api',
});

export const postApiNoneToken = (url, data) => {
  return api.post(url, data);
};

export const getAPiNoneToken = (url, data) => {
  return api.get(url, data);
};
