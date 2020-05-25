import axios from 'axios';

const isDev = process.env.NODE_ENV === 'development';
export const host = isDev ? 'http://localhost:8000' : 'https://bangdangi.com';

export default axios.create({
  baseURL: `${host}/api`,
  timeout: 1000,
  headers: {
    'Content-Type': 'application/json',
  },
});
