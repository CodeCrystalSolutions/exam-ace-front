import { axiosClient } from "./axiosClient";

export interface Result {
  id: string;
  attempt_id: string;
  exam_id: string;
  student_id: string;
  total_score: number;
  max_score: number;
  grade: string;
  visibility: "HIDDEN" | "VISIBLE";
  published_at?: string;
  created_at: string;
}

export interface PublishResultRequest {
  attempt_id: string;
  visibility?: "HIDDEN" | "VISIBLE";
}

export const resultsApi = {
  publish: async (data: PublishResultRequest): Promise<Result> => {
    const response = await axiosClient.post("/api/results/publish", data);
    return response.data;
  },

  getByExam: async (examId: string): Promise<Result[]> => {
    const response = await axiosClient.get(`/api/results/by-exam/${examId}`);
    return response.data;
  },

  getByStudent: async (): Promise<Result[]> => {
    const response = await axiosClient.get("/api/results/student/me");
    return response.data;
  },
};
