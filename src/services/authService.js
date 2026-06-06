import axios from "axios";

const BASE_URL = "http://localhost:8080/api/auth";

export const registerUser = (data) => {
  return axios.post(`${BASE_URL}/register`, data);
};

export const loginUser = (data) => {
  return axios.post(`${BASE_URL}/login`, data);
};