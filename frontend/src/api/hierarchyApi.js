import api from './client';

export const hierarchyApi = {
  // States
  getStates: async () => (await api.get('/states')).data,
  createState: async (data) => (await api.post('/states', data)).data,
  updateState: async (id, data) => (await api.put(`/states/${id}`, data)).data,
  deleteState: async (id) => (await api.delete(`/states/${id}`)).data,

  // Districts
  getDistricts: async (stateId) => {
    const url = stateId ? `/districts?state_id=${stateId}` : '/districts';
    return (await api.get(url)).data;
  },
  createDistrict: async (data) => (await api.post('/districts', data)).data,
  updateDistrict: async (id, data) => (await api.put(`/districts/${id}`, data)).data,
  deleteDistrict: async (id) => (await api.delete(`/districts/${id}`)).data,

  // Institution Types
  getInstitutionTypes: async () => (await api.get('/institution-types')).data,
  createInstitutionType: async (data) => (await api.post('/institution-types', data)).data,
  updateInstitutionType: async (id, data) => (await api.put(`/institution-types/${id}`, data)).data,
  deleteInstitutionType: async (id) => (await api.delete(`/institution-types/${id}`)).data,

  // Courses
  getCourses: async (institutionId) => {
    const url = institutionId ? `/courses?institution_id=${institutionId}` : '/courses';
    return (await api.get(url)).data;
  },
  createCourse: async (data) => (await api.post('/courses', data)).data,
  updateCourse: async (id, data) => (await api.put(`/courses/${id}`, data)).data,
  deleteCourse: async (id) => (await api.delete(`/courses/${id}`)).data,

  // Branches
  getBranches: async (courseId) => {
    const url = courseId ? `/branches?course_id=${courseId}` : '/branches';
    return (await api.get(url)).data;
  },
  createBranch: async (data) => (await api.post('/branches', data)).data,
  updateBranch: async (id, data) => (await api.put(`/branches/${id}`, data)).data,
  deleteBranch: async (id) => (await api.delete(`/branches/${id}`)).data,

  // Academic Years
  getAcademicYears: async (branchId) => {
    const url = branchId ? `/academic-years?branch_id=${branchId}` : '/academic-years';
    return (await api.get(url)).data;
  },
  createAcademicYear: async (data) => (await api.post('/academic-years', data)).data,
  updateAcademicYear: async (id, data) => (await api.put(`/academic-years/${id}`, data)).data,
  deleteAcademicYear: async (id) => (await api.delete(`/academic-years/${id}`)).data,
};
