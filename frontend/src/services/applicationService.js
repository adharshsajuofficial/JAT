import api from './api';

export const getApplications = async () => {
  const response = await api.get('/api/applications/');
  return response.data;
};

export const getApplication = async (id) => {
  const response = await api.get(`/api/applications/${id}/`);
  return response.data;
};

export const createApplication = async (data) => {
  // Ensure 'owner' is NOT sent in request body as per spec
  const payload = { ...data };
  delete payload.owner;
  const response = await api.post('/api/applications/', payload);
  return response.data;
};

export const updateApplication = async (id, data) => {
  const payload = { ...data };
  delete payload.owner;
  const response = await api.patch(`/api/applications/${id}/`, payload);
  return response.data;
};

export const deleteApplication = async (id) => {
  const response = await api.delete(`/api/applications/${id}/`);
  return response.data;
};
