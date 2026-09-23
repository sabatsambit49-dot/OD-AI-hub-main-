import api from './client';

export const graphApi = {
  getInstitutionStats: async (institutionId) => {
    return (await api.get(`/graph-data/institution/${institutionId}`)).data;
  },
  getBranchGraph: async (branchId) => {
    return (await api.get(`/graph-data/branch/${branchId}`)).data;
  },
  exportGraphCsv: async (graphPayload) => {
    return (await api.post('/graph-data/export', graphPayload, { responseType: 'blob' })).data;
  }
};
