import { axiosClient } from "./axiosClient";

export interface Attempt {
  id: string;
  exam_id: string;
  student_id: string;
  status: "NOT_STARTED" | "IN_PROGRESS" | "SUBMITTED" | "EVALUATED";
  started_at?: string;
  submitted_at?: string;
  total_score?: number;
  grade?: string;
  created_at: string;
}

export interface Answer {
  id: string;
  attempt_id: string;
  question_id: string;
  answer_text: string;
  created_at: string;
}

export interface StartAttemptRequest {
  exam_id: string;
}

export interface SubmitAnswerRequest {
  question_id: string;
  answer_text: string;
}

export const attemptsApi = {
  start: async (data: StartAttemptRequest): Promise<Attempt> => {
    const response = await axiosClient.post("/api/attempts/start", data);
    return response.data;
  },

  submitAnswer: async (attemptId: string, data: SubmitAnswerRequest): Promise<{ status: string }> => {
    const response = await axiosClient.post(`/api/attempts/${attemptId}/answer`, data);
    return response.data;
  },

  submit: async (attemptId: string): Promise<{ status: string }> => {
    const response = await axiosClient.post(`/api/attempts/${attemptId}/submit`);
    return response.data;
  },

  getByStudent: async (): Promise<Attempt[]> => {
    const response = await axiosClient.get("/api/attempts/student/me");
    return response.data;
  },

  getById: async (attemptId: string): Promise<Attempt> => {
    const response = await axiosClient.get(`/api/attempts/${attemptId}`);
    return response.data;
  },

  getAnswers: async (attemptId: string): Promise<Answer[]> => {
    const response = await axiosClient.get(`/api/attempts/${attemptId}/answers`);
    return response.data;
  },
};
