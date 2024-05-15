import axios from 'axios';
import { VITE_SERVER_URL, MODE } from '../constants/env';

const Request = axios.create({
  // baseURL: MODE === 'development' ? '/' : VITE_SERVER_URL,
  baseURL: VITE_SERVER_URL
});

console.log('Mode:', import.meta.env.MODE);
console.log('Server URL:', import.meta.env.VITE_SERVER_URL);

export default Request;
