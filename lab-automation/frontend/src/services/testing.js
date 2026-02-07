import api from "./api";

export const assignTest = (data) => {
  return api.post("/testing", data);
};

export const updateTestResult = (id, data) => {
  return api.put(`/testing/${id}`, data);
};

export const getTests = () => {
  return api.get("/testing");
};
