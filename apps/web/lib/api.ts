const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
export async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API}${path}`, { ...options, credentials: "include", headers: { "Content-Type": "application/json", ...options.headers } });
  if (!response.ok) { const body = await response.json().catch(() => ({})); throw new Error(body.message ?? "Something went wrong"); }
  return response.status === 204 ? (undefined as T) : response.json();
}
