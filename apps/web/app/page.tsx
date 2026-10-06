"use client";
import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { AuthForm } from "../components/auth-form";
import { Dashboard } from "../components/dashboard";
import { Landing } from "../components/landing";
type User = { id: string; name: string; email: string; role: "student" | "admin" | "content_manager" };
export default function Home() { const [user, setUser] = useState<User | null>(null); const [loading, setLoading] = useState(true); const [auth, setAuth] = useState(false);
  useEffect(() => { api<{user: User}>("/api/auth/me").then(x => setUser(x.user)).catch(() => {}).finally(() => setLoading(false)); }, []);
  if (loading) return <main className="grid min-h-screen place-items-center"><p className="font-medium text-slate-500">Preparing your coaching space…</p></main>;
  return user ? <Dashboard user={user} onLogout={async () => { await api("/api/auth/logout", { method: "POST" }); setUser(null); }} /> : auth ? <AuthForm onAuthenticated={setUser} /> : <Landing start={() => setAuth(true)} />;
}
