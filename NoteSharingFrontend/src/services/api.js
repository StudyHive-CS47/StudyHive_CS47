import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/file';

// Create axios instance with default config
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // Include cookies if needed for auth
});

// Add request interceptor to handle errors globally
apiClient.interceptors.request.use(
    config => {
        // You can add auth tokens here if needed
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

// Add response interceptor to handle errors globally
apiClient.interceptors.response.use(
    response => {
        return response;
    },
    error => {
        console.error('API Error:', error.response?.data || error.message);
        return Promise.reject(error);
    }
);

const api = {
    // Upload a file
    uploadFile: async (formData) => {
        try {
            const response = await apiClient.post(`/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error uploading file:', error);
            throw error;
        }
    },

    // Download a file by ID
    downloadFile: async (fileId) => {
        try {
            const response = await apiClient.get(`/download/${fileId}`, {
                responseType: 'blob', // To handle file download
            });
            return response.data;
        } catch (error) {
            console.error(`Error downloading file ${fileId}:`, error);
            throw error;
        }
    },

    // Get all files
    getAllFiles: async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/list`);
            console.log(response.data);  // Check the output in console
            return response.data;
        } catch (error) {
            console.error('Error fetching files:', error);
            throw error;

        }
    },

    // Search files by name
    searchFilesByName: async (name) => {
        try {
            const response = await apiClient.get('/file/search', {
                params: { name },
            });
            return response.data;
        } catch (error) {
            console.error('Error searching files by name:', error);
            throw error;
        }
    },

    // Search files by university
    searchFilesByUniversity: async (universityName) => {
        try {
            const response = await apiClient.get('/university', {
                params: { universityName },
            });
            return response.data;
        } catch (error) {
            console.error('Error searching files by university:', error);
            throw error;
        }
    },

    // Search files by module
    searchFilesByModule: async (moduleCode) => {
        try {
            const response = await apiClient.get('/module', {
                params: { moduleCode },
            });
            return response.data;
        } catch (error) {
            console.error('Error searching files by module:', error);
            throw error;
        }
    },

    // Search files by level
    searchFilesByLevel: async (moduleLevel) => {
        try {
            const response = await apiClient.get('/level', {
                params: { moduleLevel },
            });
            return response.data;
        } catch (error) {
            console.error('Error searching files by level:', error);
            throw error;
        }
    },

    // Search files by category (combined filters)
    searchFilesByCategory: async (filters) => {
        try {
            const response = await apiClient.get('/category', {
                params: filters, // { universityName, moduleCode, moduleLevel, uploaderName }
            });
            return response.data;
        } catch (error) {
            console.error('Error searching files by category:', error);
            throw error;
        }
    },

    // Download all files as a ZIP
    downloadFilesAsZip: async () => {
        try {
            const response = await apiClient.get('/download/zip', {
                responseType: 'blob', // To handle ZIP file download
            });
            return response.data;
        } catch (error) {
            console.error('Error downloading files as ZIP:', error);
            throw error;
        }
    },

    // Get file preview URL
    getPreviewUrl: (fileId) => {
        return `${API_BASE_URL}/file/preview/${fileId}`;
    },
};

export default api;