import axios from 'axios';

export const minkeApi = axios.create({
  baseURL: process.env.OPEN_PEER_API_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Token ${process.env.OPENPEER_API_KEY}`
  }
});
