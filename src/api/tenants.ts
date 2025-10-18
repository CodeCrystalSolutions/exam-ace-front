import { axiosClient } from "./axiosClient";

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  active: boolean;
  created_at: string;
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
};
