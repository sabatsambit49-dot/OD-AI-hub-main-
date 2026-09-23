import api from './client';

export const institutionApi = {
  getInstitutions: async (params = {}) => {
    return (await api.get('/institutions', { params })).data;
  },
  searchInstitutions: async (searchPayload) => {
    return (await api.post('/institutions/search', searchPayload)).data;
  },
  getInstitutionDetail: async (id) => {
    return (await api.get(`/institutions/${id}`)).data;
  },
  createInstitution: async (data) => {
    return (await api.post('/institutions', data)).data;
  },
  updateInstitution: async (id, data) => {
    return (await api.put(`/institutions/${id}`, data)).data;
  },
  deleteInstitution: async (id) => {
    return (await api.delete(`/institutions/${id}`)).data;
  },
  exportInstitutionCsv: async (id) => {
    return (await api.get(`/bulk/export-institutions/${id}`, { responseType: 'blob' })).data;
  },
  importInstitutionsCsv: async (formData) => {
    return (await api.post('/bulk/import-csv', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })).data;
  }
};
