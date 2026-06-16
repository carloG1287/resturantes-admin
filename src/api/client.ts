const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000";
export const socketUrl = import.meta.env.VITE_SOCKET_URL ?? API_URL;

export function getToken() {
  return localStorage.getItem("resturantes_admin_token");
}

export function setToken(token: string) {
  localStorage.setItem("resturantes_admin_token", token);
}

export function clearToken() {
  localStorage.removeItem("resturantes_admin_token");
}

export async function api<T>(path: string, options?: RequestInit): Promise<T> {
  const token = getToken();
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 12_000);
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    signal: controller.signal,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options?.headers ?? {})
    }
  });
  window.clearTimeout(timeout);
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.message ?? "No se pudo completar la solicitud");
  if (response.status === 204) return undefined as T;
  return (payload.data ?? payload) as T;
}

export async function upload<T>(path: string, formData: FormData): Promise<T> {
  const token = getToken();
  const response = await fetch(`${API_URL}${path}`, {
    method: "POST",
    body: formData,
    headers: token ? { Authorization: `Bearer ${token}` } : undefined
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.message ?? "No se pudo subir el archivo");
  return (payload.data ?? payload) as T;
}
