import { axiosClient } from "./axiosClient";

export interface Question {
  id: string;
  exam_id: string;
  question_text: string;
  question_type: "MCQ" | "SHORT_ANSWER" | "ESSAY" | "TRUE_FALSE";
  options?: string[];
  correct_answer?: string;
  points: number;
  order: number;
  rubric?: string;
  created_at: string;
}

export interface CreateQuestionRequest {
  exam_id: string;
  question_text: string;
  question_type: "MCQ" | "SHORT_ANSWER" | "ESSAY" | "TRUE_FALSE";
  options?: string[];
  correct_answer?: string;
  points: number;
  order?: number;
  rubric?: string;
}

export interface UpdateQuestionRequest {
  question_text?: string;
  question_type?: "MCQ" | "SHORT_ANSWER" | "ESSAY" | "TRUE_FALSE";
  options?: string[];
  correct_answer?: string;
  points?: number;
  order?: number;
  rubric?: string;
}

export const questionsApi = {
  getByExam: async (examId: string): Promise<Question[]> => {
    const response = await axiosClient.get(`/api/questions/by-exam/${examId}`);
    return response.data;
  },

  getById: async (questionId: string): Promise<Question> => {
    const response = await axiosClient.get(`/api/questions/${questionId}`);
    return response.data;
  },

  create: async (data: CreateQuestionRequest): Promise<Question> => {
    const response = await axiosClient.post("/api/questions", data);
    return response.data;
  },

  update: async (questionId: string, data: UpdateQuestionRequest): Promise<Question> => {
    const response = await axiosClient.put(`/api/questions/${questionId}`, data);
    return response.data;
  },

  delete: async (questionId: string): Promise<void> => {
    await axiosClient.delete(`/api/questions/${questionId}`);
  },
};
