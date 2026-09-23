import api from './client';

export const fetchCoachings = async (city) => {
    try {
        const params = city ? { city } : {};
        const response = await api.get('/coaching/', { params });
        return response.data;
    } catch (error) {
        console.error("Error fetching coachings:", error);
        throw error;
    }
};

export const fetchCoachingDetail = async (id) => {
    try {
        const response = await api.get(`/coaching/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching coaching detail:", error);
        throw error;
    }
};

export const fetchCities = async () => {
    try {
        const response = await api.get('/coaching/cities');
        return response.data;
    } catch (error) {
        console.error("Error fetching cities:", error);
        throw error;
    }
};

export const createCoaching = async (data) => {
    try {
        const response = await api.post('/coaching/', data);
        return response.data;
    } catch (error) {
        console.error("Error creating coaching:", error);
        throw error;
    }
};

export const updateCoaching = async (id, data) => {
    try {
        const response = await api.put(`/coaching/${id}`, data);
        return response.data;
    } catch (error) {
        console.error("Error updating coaching:", error);
        throw error;
    }
};

export const deleteCoaching = async (id) => {
    try {
        const response = await api.delete(`/coaching/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting coaching:", error);
        throw error;
    }
};

export const addCourse = async (coachingId, data) => {
    try {
        const response = await api.post(`/coaching/${coachingId}/courses`, data);
        return response.data;
    } catch (error) {
        console.error("Error adding course:", error);
        throw error;
    }
};

export const updateCourse = async (coachingId, courseId, data) => {
    try {
        const response = await api.put(`/coaching/${coachingId}/courses/${courseId}`, data);
        return response.data;
    } catch (error) {
        console.error("Error updating course:", error);
        throw error;
    }
};

export const deleteCourse = async (coachingId, courseId) => {
    try {
        const response = await api.delete(`/coaching/${coachingId}/courses/${courseId}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting course:", error);
        throw error;
    }
};