import api from './client';

export const fetchProblemStatements = async (params = {}) => {
  try {
    const response = await api.get('/problem-statements', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching problem statements:', error);
    throw error;
  }
};

export const fetchCategories = async () => {
  try {
    const response = await api.get('/problem-statements/categories');
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

export const fetchProblemStatement = async (id) => {
  try {
    const response = await api.get(`/problem-statements/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching problem statement:', error);
    throw error;
  }
};

export const createProblemStatement = async (formData) => {
  try {
    const response = await api.post('/problem-statements', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating problem statement:', error);
    throw error;
  }
};

export const updateProblemStatement = async (id, formData) => {
  try {
    const response = await api.put(`/problem-statements/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating problem statement:', error);
    throw error;
  }
};

export const deleteProblemStatement = async (id) => {
  try {
    const response = await api.delete(`/problem-statements/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting problem statement:', error);
    throw error;
  }
};
