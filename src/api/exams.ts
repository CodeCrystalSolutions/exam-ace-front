import { axiosClient } from "./axiosClient";

export interface Exam {
  id: string;
  title: string;
  description?: string;
  duration_minutes: number;
  passing_score: number;
  active: boolean;
  status?: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  tenant_id: string;
  created_by: string;
  created_at: string;
}

export interface CreateExamRequest {
  title: string;
  description?: string;
  duration_minutes: number;
  passing_score: number;
}

export interface UpdateExamRequest {
  title?: string;
  description?: string;
  duration_minutes?: number;
  passing_score?: number;
  active?: boolean;
}

export const examsApi = {
  getAll: async (): Promise<Exam[]> => {
    const response = await axiosClient.get("/api/exams");
    return response.data;
  },

  getById: async (id: string): Promise<Exam> => {
    const response = await axiosClient.get(`/api/exams/${id}`);
    return response.data;
  },

  create: async (data: CreateExamRequest): Promise<Exam> => {
    const response = await axiosClient.post("/api/exams", data);
    return response.data;
  },

  update: async (id: string, data: UpdateExamRequest): Promise<Exam> => {
    const response = await axiosClient.put(`/api/exams/${id}`, data);
    return response.data;
  },
};
