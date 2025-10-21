import { axiosClient } from "./axiosClient";

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  active: boolean;
  created_at: string;
}

export interface CreateTenantRequest {
  name: string;
  slug: string;
  active: boolean;
}

export interface UpdateTenantRequest {
  name?: string;
  slug?: string;
  active?: boolean;
}

export const tenantsApi = {
  getBySlug: async (slug: string): Promise<Tenant> => {
    const response = await axiosClient.get(`/api/tenants/${slug}`);
    return response.data;
  },

  getMe: async (): Promise<Tenant> => {
    const response = await axiosClient.get("/api/tenants/me");
    return response.data;
  },

  getAll: async (): Promise<Tenant[]> => {
    const response = await axiosClient.get("/api/tenants");
    return response.data;
  },

  create: async (data: CreateTenantRequest): Promise<Tenant> => {
    const response = await axiosClient.post("/api/tenants", data);
    return response.data;
  },

  update: async (id: string, data: UpdateTenantRequest): Promise<Tenant> => {
    const response = await axiosClient.put(`/api/tenants/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await axiosClient.delete(`/api/tenants/${id}`);
  },
};
