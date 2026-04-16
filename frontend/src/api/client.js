const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const request = async (path, options = {}, token) => {
  const headers = options.body instanceof FormData ? {} : { "Content-Type": "application/json" };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: { ...headers, ...(options.headers || {}) },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
};

export const api = {
  get: (path, token) => request(path, { method: "GET" }, token),
  post: (path, body, token) => request(path, { method: "POST", body: body instanceof FormData ? body : JSON.stringify(body) }, token),
  patch: (path, body, token) => request(path, { method: "PATCH", body: JSON.stringify(body) }, token),
  del: (path, token) => request(path, { method: "DELETE" }, token),
};
