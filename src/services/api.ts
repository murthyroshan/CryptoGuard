import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

export const getMarketData = async (params = {}) => {
  const response = await api.get('/market-data', { params });
  return response.data;
};

export const getCoinData = async (id: string) => {
  const response = await api.get(`/coin/${id}`);
  return response.data;
};

export default api;
