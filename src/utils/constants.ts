export const ROLES = {
  ROOT_ADMIN: "root_admin",
  ADMIN: "admin",
  TEACHER: "teacher",
  STUDENT: "student",
} as const;

export const API_ENDPOINTS = {
  AUTH: {
    SIGNUP: "/api/auth/signup",
    LOGIN: "/api/auth/login",
    PROFILE: "/api/auth/profile",
  },
  TENANTS: {
    BY_SLUG: "/api/tenants",
    ME: "/api/tenants/me",
    ALL: "/api/tenants",
  },
  USERS: {
    ALL: "/api/users",
    CREATE: "/api/users",
    UPDATE: "/api/users",
    DELETE: "/api/users",
  },
  EXAMS: {
    ALL: "/api/exams",
    CREATE: "/api/exams",
    UPDATE: "/api/exams",
    BY_ID: "/api/exams",
  },
} as const;
