import { axiosClient } from "./axiosClient";

export interface SignupRequest {
  tenant_slug: string;
  full_name: string;
  email: string;
  password: string;
  role: "admin" | "teacher" | "student";
}

export interface SignupResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    full_name: string;
    role: string;
    tenant_id: string;
  };
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  id: string;
  role: string;
  tenant_id: string;
}

export interface ProfileResponse {
  id: string;
  email: string;
  full_name: string;
  role: string;
  active: boolean;
  tenant_id: string;
}

export const authApi = {
  signup: async (data: SignupRequest): Promise<SignupResponse> => {
    const response = await axiosClient.post("/api/auth/signup", data);
    return response.data;
  },

  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await axiosClient.post("/api/auth/login", data);
    return response.data;
  },

  getProfile: async (): Promise<ProfileResponse> => {
    const response = await axiosClient.get("/api/auth/profile");
    return response.data;
  },
};
