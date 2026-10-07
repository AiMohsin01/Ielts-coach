"use client";
import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { AuthForm } from "../components/auth-form";
import { Dashboard } from "../components/dashboard";
import { Landing } from "../components/landing";
type User = { id: string; name: string; email: string; role: "student" | "admin" | "content_manager" };
export default function Home() { const [user, setUser] = useState<User | null>(null); const [loading, setLoading] = useState(true); const [auth, setAuth] = useState<"login" | "register" | null>(null);
  useEffect(() => { api<{user: User}>("/api/auth/me").then(x => setUser(x.user)).catch(() => {}).finally(() => setLoading(false)); }, []);
  if (loading) return <main className="grid min-h-screen place-items-center"><p className="font-medium text-slate-500">Preparing your coaching space…</p></main>;
  return user ? <Dashboard user={user} onLogout={async () => { await api("/api/auth/logout", { method: "POST" }); setUser(null); setAuth(null); }} /> : auth ? <AuthForm key={auth} initialMode={auth} onBack={() => setAuth(null)} onAuthenticated={nextUser => { setUser(nextUser); window.scrollTo(0, 0); }} /> : <Landing start={() => { setAuth("register"); window.scrollTo(0, 0); }} login={() => { setAuth("login"); window.scrollTo(0, 0); }} />;
}
