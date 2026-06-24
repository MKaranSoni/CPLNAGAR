import api from "./api";

export const createComplaint = async (formData) => {
  return await api.post(
    "/api/complaints/upload",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
};

export const getAllComplaints = async (page = 0, size = 10) => {
  return await api.get(`/api/complaints?page=${page}&size=${size}`);
};

export const getComplaintsByCity = async (city, page = 0, size = 10) => {
  return await api.get(`/api/complaints/city?city=${city}&page=${page}&size=${size}`);
};

export const getComments = async (complaintId) => {
  return await api.get(`/api/complaints/${complaintId}/comments`);
};

export const addComment = async (complaintId, message) => {
  return await api.post(`/api/complaints/${complaintId}/comments`, { message });
};


export const getMyComplaints = async () => {
  return await api.get("/api/complaints/my");
};

export const getComplaintsByCategory = async (category) => {
  return await api.get(`/api/complaints/category?category=${category}`);
};

export const getComplaintsBySeverity = async (severity) => {
  return await api.get(`/api/complaints/severity?severity=${severity}`);
};

export const getComplaintsByStatus = async (status) => {
  return await api.get(`/api/complaints/status?status=${status}`);
};

export const upvoteComplaint = async (id) => {
  return await api.post(`/api/complaints/${id}/upvote`);
};

export const removeUpvote = async (id) => {
  return await api.delete(`/api/complaints/${id}/upvote`);
};

export const updateComplaintStatus = async (id, status) => {
  return await api.put(`/api/complaints/${id}/status?status=${status}`);
};