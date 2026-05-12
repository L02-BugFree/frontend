// ─── NexTime API Client ────────────────────────────────────────────────────────
export const BASE_URL = "https://nextime-mobile-app.onrender.com";

let _token: string | null = null;

export const auth = {
  setToken: (t: string) => { _token = t; },
  getToken: () => _token,
  clearToken: () => { _token = null; },
};

async function request<T>(
  method: "GET" | "POST" | "PATCH" | "DELETE",
  path: string,
  body?: unknown,
): Promise<T> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (_token) headers["Authorization"] = `Bearer ${_token}`;

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err?.message ?? `HTTP ${res.status}`);
  }

  return res.json();
}

// ─── Auth ─────────────────────────────────────────────────────────────────────
export interface LoginResponse {
  access_token: string;
  user: UserProfile;
}

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
  friendCode?: string;
  language?: "vi" | "en";
  theme?: "light" | "dark";
  birthdate?: string;
  gender?: string;
}

export const authApi = {
  login: (email: string, password: string) =>
    request<LoginResponse>("POST", "/auth/login", { email, password }),

  register: (payload: {
    email: string;
    password: string;
    displayName: string;
    birthdate?: string;
    gender?: string;
    avatarUrl?: string;
    language?: string;
  }) => request<LoginResponse>("POST", "/auth/register", payload),

  google: (idToken: string) =>
    request<LoginResponse>("POST", "/auth/google", { idToken }),
};

// ─── Users ────────────────────────────────────────────────────────────────────
export const usersApi = {
  me: () => request<UserProfile>("GET", "/users/me"),

  updateProfile: (data: Partial<Pick<UserProfile, "displayName" | "avatarUrl" | "birthdate" | "gender">>) =>
    request<UserProfile>("PATCH", "/users/profile", data),

  updateSettings: (data: { theme?: "light" | "dark"; language?: "vi" | "en" }) =>
    request<UserProfile>("PATCH", "/users/settings", data),

  getQr: () => request<{ friendCode: string }>("GET", "/users/qr"),
};

// ─── Schedule ─────────────────────────────────────────────────────────────────
export interface ScheduleEvent {
  id: string;
  title: string;
  description?: string;
  colorHex?: string;
  tag?: string;
  // Weekly
  startTime?: string; // "HH:mm"
  endTime?: string;
  dayOfWeek?: number; // 1=Mon … 7=Sun
  // One-shot
  startDate?: string;
  endDate?: string;
  remindBefore?: number;
}

export interface HeatmapSlot {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  count: number;
  members: string[];
}

export const scheduleApi = {
  getAll: (groupId?: string) =>
    request<ScheduleEvent[]>("GET", groupId ? `/schedule?groupId=${groupId}` : "/schedule"),

  getById: (id: string) => request<ScheduleEvent>("GET", `/schedule/${id}`),

  createWeekly: (data: {
    title: string;
    description?: string;
    startTime: string;
    endTime: string;
    dayOfWeek: number;
    colorHex?: string;
    tag?: string;
    remindBefore?: number;
  }) => request<ScheduleEvent>("POST", "/schedule/weekly", data),

  createOneshot: (data: {
    title: string;
    description?: string;
    startTime: string;
    endTime: string;
    colorHex?: string;
    tag?: string;
    remindBefore?: number;
  }) => request<ScheduleEvent>("POST", "/schedule/oneshot", data),

  update: (id: string, data: Partial<ScheduleEvent>) =>
    request<ScheduleEvent>("PATCH", `/schedule/${id}`, data),

  delete: (id: string) =>
    request<void>("DELETE", `/schedule/${id}`),

  heatmap: (groupId: string) =>
    request<HeatmapSlot[]>("GET", `/schedule/heatmap/${groupId}`),
};

// ─── Group ────────────────────────────────────────────────────────────────────
export interface Group {
  id: string;
  name: string;
  memberCount?: number;
  avatarUrl?: string;
}

export const groupApi = {
  list: () => request<Group[]>("GET", "/group"),

  create: (name: string) => request<Group>("POST", "/group", { name }),

  heatmap: (id: string) =>
    request<HeatmapSlot[]>("GET", `/group/heatmap/${id}`),
};

// ─── Checklist ────────────────────────────────────────────────────────────────
export interface ChecklistItem {
  label: string;
  assignee?: string;
}

export interface ChecklistPreview {
  previewId: string;
  title: string;
  items: ChecklistItem[];
}

export const checklistApi = {
  preview: (prompt: string) =>
    request<ChecklistPreview>("POST", "/checklists/preview", { prompt }),

  confirm: (previewId: string) =>
    request<{ id: string }>("POST", "/checklists/confirm", { previewId }),

  getAll: () => request<ChecklistPreview[]>("GET", "/checklists"),
};
