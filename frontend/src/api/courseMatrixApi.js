import api from './client';

export const fetchCourseMatrix = async () => {
    try {
        const response = await api.get('/course-matrix/');
        return response.data;
    } catch (error) {
        console.error("Error fetching course matrix data:", error);
        throw error;
    }
};

export const fetchCities = async () => {
    try {
        const response = await api.get('/course-matrix/cities');
        return response.data;
    } catch (error) {
        console.error("Error fetching cities:", error);
        throw error;
    }
};

export const addCollege = async (data) => {
    try {
        const response = await api.post('/course-matrix/colleges', data);
        return response.data;
    } catch (error) {
        console.error("Error adding college:", error);
        throw error;
    }
};