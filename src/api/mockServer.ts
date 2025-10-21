// Mock API server using axios-mock-adapter for frontend-only development
// Toggle: set VITE_USE_MOCK to "true" to enable, or comment out the import in main.tsx.

import MockAdapter from "axios-mock-adapter";
import { axiosClient } from "./axiosClient";
import type { Exam } from "./exams";

// Enable mocks by default for this preview session. Set to false to disable.
const ENABLE_MOCKS = (import.meta as any).env?.VITE_USE_MOCK === "true" || true;

if (ENABLE_MOCKS) {
  const mock = new MockAdapter(axiosClient, { delayResponse: 400 });

  type Role = "root_admin" | "admin" | "teacher" | "student";

  const tenant = { id: "t1", name: "Acme Academy", slug: "acme", plan: "pro", active: true, created_at: new Date().toISOString() };

  const passwordByEmail: Record<string, string> = {
    "rootadmin@test.com": "password123",
    "admin@test.com": "password123",
    "teacher@test.com": "password123",
    "student@test.com": "password123",
  };

  const users = [
    { id: "u1", email: "rootadmin@test.com", full_name: "Root Admin", role: "root_admin" as Role, active: true, tenant_id: tenant.id, created_at: new Date().toISOString() },
    { id: "u2", email: "admin@test.com", full_name: "Org Admin", role: "admin" as Role, active: true, tenant_id: tenant.id, created_at: new Date().toISOString() },
    { id: "u3", email: "teacher@test.com", full_name: "Teacher User", role: "teacher" as Role, active: true, tenant_id: tenant.id, created_at: new Date().toISOString() },
    { id: "u4", email: "student@test.com", full_name: "Student User", role: "student" as Role, active: true, tenant_id: tenant.id, created_at: new Date().toISOString() },
  ];

  const exams: Exam[] = [
    {
      id: "e1",
      title: "Sample Math Exam",
      description: "Algebra & Geometry basics",
      duration_minutes: 60,
      passing_score: 60,
      active: true,
      status: "PUBLISHED" as const,
      tenant_id: tenant.id,
      created_by: "u3",
      created_at: new Date().toISOString(),
    },
  ];

  // Helper: current user from localStorage
  const getCurrentUser = () => {
    try {
      const raw = localStorage.getItem("mock_user");
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      return users.find((u) => u.id === parsed?.id) || null;
    } catch {
      return null;
    }
  };

  // AUTH -------------------------------------------------------
  mock.onPost("/api/auth/login").reply((config) => {
    try {
      const { email, password } = JSON.parse(config.data || "{}");
      if (!email || !password) {
        return [400, { detail: "Email and password required" }];
      }
      const expected = passwordByEmail[email];
      const user = users.find((u) => u.email === email);
      if (!expected || password !== expected || !user) {
        return [401, { detail: "Invalid credentials" }];
      }
      const token = `mock-token-${user.id}`;
      localStorage.setItem("access_token", token);
      localStorage.setItem("mock_user", JSON.stringify(user));
      return [200, { access_token: token, id: user.id, role: user.role, tenant_id: user.tenant_id }];
    } catch (e) {
      return [500, { detail: "Login failed" }];
    }
  });

  mock.onPost("/api/auth/signup").reply((config) => {
    try {
      const { tenant_slug, full_name, email, password, role } = JSON.parse(config.data || "{}");
      if (!email || !password || !full_name) return [400, { detail: "Missing fields" }];
      if (users.some((u) => u.email === email)) return [400, { detail: "User already exists" }];
      const id = `u${users.length + 1}`;
      const newUser = { id, email, full_name, role: (role || "student") as Role, active: true, tenant_id: tenant.id, created_at: new Date().toISOString() };
      (passwordByEmail as any)[email] = password;
      users.push(newUser);
      const token = `mock-token-${id}`;
      localStorage.setItem("access_token", token);
      localStorage.setItem("mock_user", JSON.stringify(newUser));
      return [200, { access_token: token, token_type: "bearer", expires_in_min: 60 }];
    } catch {
      return [500, { detail: "Signup failed" }];
    }
  });

  mock.onGet("/api/auth/profile").reply(() => {
    const user = getCurrentUser();
    if (!user) return [401, { detail: "Unauthorized" }];
    const { id, email, full_name, role, tenant_id } = user;
    return [200, { id, email, full_name, role, active: true, tenant_id }];
  });

  // TENANTS ----------------------------------------------------
  const tenants = [tenant];

  mock.onGet("/api/tenants/me").reply(() => {
    const user = getCurrentUser();
    if (!user) return [401, { detail: "Unauthorized" }];
    const userTenant = tenants.find((t) => t.id === user.tenant_id);
    return [200, userTenant || tenant];
  });

  mock.onGet("/api/tenants").reply(() => {
    const user = getCurrentUser();
    if (!user || user.role !== "root_admin") return [403, { detail: "Forbidden" }];
    return [200, tenants];
  });

  mock.onPost("/api/tenants").reply((config) => {
    try {
      const user = getCurrentUser();
      if (!user || user.role !== "root_admin") return [403, { detail: "Forbidden" }];
      const { name, slug, active } = JSON.parse(config.data || "{}");
      if (!name || !slug) return [400, { detail: "Missing fields" }];
      if (tenants.some((t) => t.slug === slug)) return [400, { detail: "Slug already exists" }];
      const id = `t${tenants.length + 1}`;
      const newTenant = {
        id,
        name,
        slug,
        plan: "basic",
        active: active !== undefined ? active : true,
        created_at: new Date().toISOString(),
      };
      tenants.push(newTenant);
      return [200, newTenant];
    } catch {
      return [500, { detail: "Create tenant failed" }];
    }
  });

  mock.onPut(/\/api\/tenants\/[^/]+$/).reply((config) => {
    try {
      const user = getCurrentUser();
      if (!user || user.role !== "root_admin") return [403, { detail: "Forbidden" }];
      const id = config.url!.split("/").pop()!;
      const patch = JSON.parse(config.data || "{}");
      const idx = tenants.findIndex((t) => t.id === id);
      if (idx === -1) return [404, { detail: "Not found" }];
      tenants[idx] = { ...tenants[idx], ...patch };
      return [200, tenants[idx]];
    } catch {
      return [500, { detail: "Update failed" }];
    }
  });

  mock.onDelete(/\/api\/tenants\/[^/]+$/).reply((config) => {
    const user = getCurrentUser();
    if (!user || user.role !== "root_admin") return [403, { detail: "Forbidden" }];
    const id = config.url!.split("/").pop()!;
    const idx = tenants.findIndex((t) => t.id === id);
    if (idx === -1) return [404, { detail: "Not found" }];
    tenants.splice(idx, 1);
    return [200, {}];
  });

  // USERS ------------------------------------------------------
  mock.onGet("/api/users").reply(200, users.map(({ id, email, full_name, role, active, tenant_id, created_at }) => ({ id, email, full_name, role: (role as any) === "root_admin" ? "admin" : role, active, tenant_id, created_at })));

  mock.onPost("/api/users").reply((config) => {
    try {
      const { email, full_name, password, role } = JSON.parse(config.data || "{}");
      if (!email || !password || !role) return [400, { detail: "Missing fields" }];
      if (users.some((u) => u.email === email)) return [400, { detail: "User exists" }];
      const id = `u${users.length + 1}`;
      const u = { id, email, full_name: full_name || email.split("@")[0], role: (role || "student") as Role, active: true, tenant_id: tenant.id, created_at: new Date().toISOString() };
      (passwordByEmail as any)[email] = password;
      users.push(u);
      return [200, { ...u, role: (u.role as any) === "root_admin" ? "admin" : u.role }];
    } catch {
      return [500, { detail: "Create user failed" }];
    }
  });

  mock.onPut(/\/api\/users\/[^/]+$/).reply((config) => {
    try {
      const id = config.url!.split("/").pop()!;
      const patch = JSON.parse(config.data || "{}");
      const idx = users.findIndex((u) => u.id === id);
      if (idx === -1) return [404, { detail: "Not found" }];
      users[idx] = { ...users[idx], ...patch } as any;
      return [200, users[idx]];
    } catch {
      return [500, { detail: "Update failed" }];
    }
  });

  mock.onDelete(/\/api\/users\/[^/]+$/).reply((config) => {
    const id = config.url!.split("/").pop()!;
    const idx = users.findIndex((u) => u.id === id);
    if (idx === -1) return [404, { detail: "Not found" }];
    users.splice(idx, 1);
    return [200, {}];
  });

  // EXAMS ------------------------------------------------------
  mock.onGet("/api/exams").reply(200, exams);

  mock.onGet(/\/api\/exams\/[^/]+$/).reply((config) => {
    const id = config.url!.split("/").pop()!;
    const exam = exams.find((e) => e.id === id);
    if (!exam) return [404, { detail: "Not found" }];
    return [200, exam];
  });

  mock.onPost("/api/exams").reply((config) => {
    try {
      const user = getCurrentUser();
      if (!user || (user.role !== "admin" && user.role !== "teacher")) return [403, { detail: "Forbidden" }];
      const data = JSON.parse(config.data || "{}");
      const id = `e${exams.length + 1}`;
      const now = new Date().toISOString();
      const newExam = {
        id,
        title: data.title,
        description: data.description || "",
        duration_minutes: Number(data.duration_minutes) || 60,
        passing_score: Number(data.passing_score) || 60,
        active: true,
        status: "DRAFT" as const,
        tenant_id: tenant.id,
        created_by: user.id,
        created_at: now,
      };
      exams.push(newExam);
      return [200, newExam];
    } catch {
      return [500, { detail: "Create exam failed" }];
    }
  });

  mock.onPut(/\/api\/exams\/[^/]+$/).reply((config) => {
    try {
      const id = config.url!.split("/").pop()!;
      const patch = JSON.parse(config.data || "{}");
      const idx = exams.findIndex((e) => e.id === id);
      if (idx === -1) return [404, { detail: "Not found" }];
      exams[idx] = { ...exams[idx], ...patch } as any;
      return [200, exams[idx]];
    } catch {
      return [500, { detail: "Update exam failed" }];
    }
  });

  // QUESTIONS (minimal) ---------------------------------------
  mock.onGet(/\/api\/questions\/by-exam\/.+$/).reply(200, []);
  mock.onPost("/api/questions").reply(200, { id: "q1" });

  // ATTEMPTS (minimal) ----------------------------------------
  mock.onPost("/api/attempts/start").reply(200, { attempt_id: "a1", status: "IN_PROGRESS" });
  mock.onPost(/\/api\/attempts\/[^/]+\/answer$/).reply(200, { status: "saved" });
  mock.onPost(/\/api\/attempts\/[^/]+\/submit$/).reply(200, { status: "submitted" });

  // EVALUATION / FEEDBACK / RESULTS (minimal) -----------------
  mock.onPost("/api/evaluation/one").reply(200, { total: 80, rubric_scores: [], status: "DONE" });
  mock.onGet(/\/api\/feedback\/student\/.+$/).reply(200, { student_feedback: "Well done!", teacher_rationale: "Good answers." });
  mock.onGet(/\/api\/results\/by-exam\/.+$/).reply(200, [
    { attempt_id: "a1", total: 80, grade: "B", visibility: "visible" },
  ]);
}
