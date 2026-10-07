"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { api } from "../lib/api";
import { Icon } from "./dashboard";
import { WorkspaceNavigation, menuGroups } from "./workspace-navigation";
type User = { name: string; role: string };
export function WorkspaceShell({ children }: { children: React.ReactNode }) {
  const path = usePathname(); const [user,setUser] = useState<User | null>(null); const [error,setError] = useState(""); const [open,setOpen] = useState(false); const [dark,setDark] = useState(false);
  useEffect(() => { api<{user:User}>("/api/auth/me").then(d=>setUser(d.user)).catch(e=>setError(e instanceof Error ? e.message : "Please sign in")); setDark(localStorage.getItem("ielts-theme") === "dark"); }, []);
  useEffect(() => { setOpen(false); }, [path]);
  useEffect(() => { const close = (e: KeyboardEvent) => { if(e.key === "Escape")setOpen(false); }; window.addEventListener("keydown",close); return ()=>window.removeEventListener("keydown",close); }, []);
  const title = menuGroups.flatMap(g=>g.items).find(([, ,href]) => href !== "/" && path.startsWith(href))?.[0] ?? "IELTS workspace";
  if(error) return <main className="workspace-access"><h1>Sign in to your learning workspace</h1><p>{error}</p><a className="workspace-primary-button" href="/">Go to sign in →</a></main>;
  if(!user) return <main className="workspace-access" role="status">Opening your learning workspace…</main>;
  return <div className={`student-workspace ${dark ? "dark-workspace" : ""}`}><a className="workspace-skip" href="#learning-main">Skip to content</a>{open && <button className="sidebar-backdrop" aria-label="Close navigation" onClick={()=>setOpen(false)}/>}<aside className={`workspace-sidebar ${open ? "sidebar-open" : ""}`} aria-label="Main navigation"><div className="sidebar-brand"><a href="/">IELTS<span>coach</span><sup>AI</sup></a><button className="sidebar-close" aria-label="Close navigation" onClick={()=>setOpen(false)}><Icon name="close"/></button></div><WorkspaceNavigation path={path} close={()=>setOpen(false)} staff={user.role !== "student"}/><div className="sidebar-account"><div className="sidebar-language"><span>🇬🇧 <span><small>LANGUAGE</small>English</span></span><button onClick={()=>{setDark(!dark);localStorage.setItem("ielts-theme",dark?"light":"dark");}} aria-label={dark?"Switch to light mode":"Switch to dark mode"}><Icon name="moon"/></button></div><a className="account-profile" href="/onboarding"><span className="user-avatar">{user.name[0]?.toUpperCase()}</span><span><b>{user.name}</b><small>Your learning profile</small></span></a><button className="logout-button" onClick={async()=>{try{await api("/api/auth/logout",{method:"POST"});window.location.href="/";}catch{setError("Could not log out. Please try again.");}}}>Log out</button></div></aside><main className="workspace-main learning-workspace" id="learning-main"><header className="learning-topbar"><button className="mobile-nav-toggle" aria-label="Open navigation" onClick={()=>setOpen(true)}><Icon name="menu"/></button><span>{title}</span><a href="/dashboard/tutorials">ⓘ Quick guide</a></header>{children}<footer className="workspace-footer"><span>A little better, every day.<br/><small>IELTS AI Coach · Learn at your own pace</small></span><a href="/dashboard/support">Need help? ↗</a></footer></main></div>;
}
