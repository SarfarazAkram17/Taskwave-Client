import { auth } from "../../firebase.config";

export const API_URL = (
  import.meta.env.VITE_API_URL || "https://assignment-10-sarfaraz-akram.vercel.app"
).replace(/\/$/, "");

export class ApiError extends Error {
  constructor(message, status, code) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

async function request(method, path, { body, query } = {}) {
  const headers = {};
  if (body !== undefined) headers["Content-Type"] = "application/json";
  const user = auth.currentUser;
  if (user) {
    try {
      headers.Authorization = `Bearer ${await user.getIdToken()}`;
    } catch {
      /* request continues anonymously; the server will reject if auth is needed */
    }
  }
  let url = `${API_URL}${path}`;
  if (query) {
    const params = new URLSearchParams();
    Object.entries(query).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== "") params.set(k, v);
    });
    const qs = params.toString();
    if (qs) url += `?${qs}`;
  }
  let res;
  try {
    res = await fetch(url, { method, headers, body: body !== undefined ? JSON.stringify(body) : undefined });
  } catch {
    throw new ApiError("Can't reach the server. Check your connection and try again.", 0, "NETWORK");
  }
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new ApiError(data?.message || data?.error || "Something went wrong", res.status, data?.code);
  }
  return data;
}

export const api = {
  get: (path, query) => request("GET", path, { query }),
  post: (path, body = {}) => request("POST", path, { body }),
  put: (path, body = {}) => request("PUT", path, { body }),
  patch: (path, body = {}) => request("PATCH", path, { body }),
  delete: (path) => request("DELETE", path),
};
