import { axiosClient } from "./axiosClient";

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: "admin" | "teacher" | "student";
  active: boolean;
  tenant_id: string;
  created_at: string;
}

export interface CreateUserRequest {
  email: string;
  full_name: string;
  password: string;
  role: "admin" | "teacher" | "student";
}

export interface UpdateUserRequest {
  email?: string;
  full_name?: string;
  role?: "admin" | "teacher" | "student";
  active?: boolean;
}

export const usersApi = {
  getAll: async (): Promise<User[]> => {
    const response = await axiosClient.get("/api/users");
    return response.data;
  },

  create: async (data: CreateUserRequest): Promise<User> => {
    const response = await axiosClient.post("/api/users", data);
    return response.data;
  },

  update: async (id: string, data: UpdateUserRequest): Promise<User> => {
    const response = await axiosClient.put(`/api/users/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await axiosClient.delete(`/api/users/${id}`);
  },
};
