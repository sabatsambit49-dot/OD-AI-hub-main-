import api from './client';

export const syllabusApi = {
  getSyllabusByBranch: async (branchId) => {
    return (await api.get(`/syllabus/branch/${branchId}`)).data;
  },
  getSyllabusByAcademicYear: async (academicYearId) => {
    return (await api.get(`/syllabus/academic-year/${academicYearId}`)).data;
  },
  uploadSyllabus: async (formData) => {
    return (await api.post('/syllabus/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })).data;
  },
  updateSyllabus: async (id, data) => {
    return (await api.put(`/syllabus/${id}`, data)).data;
  },
  deleteSyllabus: async (id) => {
    return (await api.delete(`/syllabus/${id}`)).data;
  }
};
