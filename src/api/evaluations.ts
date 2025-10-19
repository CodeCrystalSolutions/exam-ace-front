import { axiosClient } from "./axiosClient";

export interface EvaluationRequest {
  attempt_id: string;
  question_id: string;
  student_answer: string;
  question_text: string;
  rubric?: string;
  max_points: number;
}

export interface EvaluationResponse {
  score: number;
  feedback: string;
  rubric_scores?: Record<string, number>;
  total: number;
  status: string;
}

export interface BatchEvaluation {
  id: string;
  attempt_id: string;
  status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";
  created_at: string;
  completed_at?: string;
}

export interface StudentFeedback {
  attempt_id: string;
  student_feedback: string;
  teacher_rationale: string;
  total_score: number;
  grade: string;
}

export const evaluationsApi = {
  evaluateOne: async (data: EvaluationRequest): Promise<EvaluationResponse> => {
    const response = await axiosClient.post("/api/evaluation/one", data);
    return response.data;
  },

  evaluateAll: async (attemptId: string): Promise<BatchEvaluation> => {
    const response = await axiosClient.post("/api/evaluation/all", { attempt_id: attemptId });
    return response.data;
  },

  getBatchStatus: async (batchId: string): Promise<BatchEvaluation> => {
    const response = await axiosClient.get(`/api/evaluation/batch/${batchId}`);
    return response.data;
  },

  getStudentFeedback: async (attemptId: string): Promise<StudentFeedback> => {
    const response = await axiosClient.get(`/api/feedback/student/${attemptId}`);
    return response.data;
  },

  regenerateFeedback: async (attemptId: string): Promise<StudentFeedback> => {
    const response = await axiosClient.post(`/api/feedback/student/${attemptId}/regenerate`);
    return response.data;
  },
};
