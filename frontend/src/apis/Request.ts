import axios from 'axios';
import { VITE_SERVER_URL, MODE } from '../constants/env';

const Request = axios.create({
  baseURL: VITE_SERVER_URL
});

export default Request;
