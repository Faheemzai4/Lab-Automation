import api from "./api";
import { useRouter } from "next/navigation";

export interface AuthResponse {
  user: {
    _id: string;
    name: string;
    email: string;
    role: string;
  };
  token: string;
}

export const loginUser = async (
  email: string,
  password: string,
): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>("/auth/login", {
    email,
    password,
  });
  return response.data;
};

export const signupUser = async (
  name: string,
  email: string,
  password: string,
  role: string,
): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>("/auth/signup", {
    name,
    email,
    password,
    role,
  });
  return response.data;
};

export const logoutUser = (router: ReturnType<typeof useRouter>) => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  router.push("/auth/login");
};
