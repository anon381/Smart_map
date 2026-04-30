const BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? "https://smartmap-api.onrender.com/api" : "http://localhost:5002/api");

export async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem("token");
  
  const headers = new Headers(options.headers || {});
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  if (!(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (response.status === 401 && endpoint !== "/auth/login" && endpoint !== "/auth/register") {
    localStorage.removeItem("token");
    window.location.href = "/signin";
    return;
  }

  if (!response.ok) {
    throw new Error(data.error || data.message || "An error occurred");
  }

  return data;
}

export const authApi = {
  login: (credentials: any) => 
    apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    }),
  register: (data: any) => 
    apiRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  getMe: () => apiRequest("/auth/me"),
};
