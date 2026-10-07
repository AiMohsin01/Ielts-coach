"use client";
import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { WorkspaceNavigation } from "./workspace-navigation";

type User = { name: string; role: string };
type Profile = { currentLevel: number | null; targetBand: number | null; examDate: string | null; dailyStudyMinutes: number | null; onboardingCompleted: boolean };
type Task = { id: string; taskType: string; taskDescription: string; duration: number; status: string };
type Coach = { tasks: Task[]; recommendations: { id: string; reason: string }[]; bandPrediction: number | null; studyStreak: number; examCountdown: number | null; vocabulary: { mastered: number; due: number } };
type Report = { skills: { writing: number | null; speaking: number | null }; improvement: { writing: { band: number; date: string }[]; speaking: { band: number; date: string }[] } };
const skillItems = [["Reading", "book", "blue"], ["Listening", "headphones", "amber"], ["Writing", "pen", "green"], ["Speaking", "mic", "purple"]] as const;

export function Icon({ name }: { name: string }) {
  const paths: Record<string, React.ReactNode> = {
    grid: <><rect x="3" y="3" width="6" height="6" rx="1"/><rect x="15" y="3" width="6" height="6" rx="1"/><rect x="3" y="15" width="6" height="6" rx="1"/><rect x="15" y="15" width="6" height="6" rx="1"/></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4m10-4v4M3 11h18"/></>,
    book: <><path d="M12 5v16M3 4h5a4 4 0 014 3 4 4 0 014-3h5v16h-5a4 4 0 00-4 1 4 4 0 00-4-1H3z"/></>,
    headphones: <><path d="M3 13v-1a9 9 0 0118 0v1"/><rect x="3" y="12" width="4" height="8" rx="2"/><rect x="17" y="12" width="4" height="8" rx="2"/></>,
    pen: <><path d="M12 3l9 9-8 8-9-3-3-9zM4 17l6-6"/><circle cx="12" cy="9" r="2"/></>,
    mic: <><rect x="9" y="2" width="6" height="13" rx="3"/><path d="M5 10v2a7 7 0 0014 0v-2M12 19v3m-4 0h8"/></>,
    chart: <><path d="M3 3v18h18M7 16v-5m5 5V7m5 9V4"/></>,
    flame: <path d="M13 2c1 6-4 7-4 10-2-1-2-3-2-3-4 5-3 12 5 12s11-8 5-13c0 3-2 4-2 4 1-4 0-7-2-10z"/>,
    clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l4 2"/></>,
    target: <><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/></>,
    bolt: <path d="M13 2L4 14h7l-1 8 10-12h-8z"/>,
    chat: <path d="M21 12a9 9 0 01-9 9 10 10 0 01-4-1l-5 1 1-5a10 10 0 01-1-4 9 9 0 0118 0z"/>,
    layers: <><path d="M12 3l10 6-10 6L2 9zM2 13l10 6 10-6M2 17l10 6 10-6"/></>,
    arrow: <path d="M4 12h16m-6-6l6 6-6 6"/>,
    menu: <path d="M4 6h16M4 12h16M4 18h16"/>,
    moon: <path d="M21 13A9 9 0 0111 3a9 9 0 1010 10z"/>,
    close: <path d="M6 6l12 12M18 6L6 18"/>,
  };
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name] ?? paths.book}</svg>;
}

export function CoachMascot() {
  return <svg className="coach-mascot" viewBox="0 0 200 220" aria-hidden="true"><ellipse cx="104" cy="206" rx="70" ry="9" fill="#e9a3a5" opacity=".25"/><path d="M43 90L34 47l41 21M159 90l10-43-40 21" fill="#cc2637"/><path d="M104 60c-62 0-77 44-75 95l-8 46h161l-9-46c2-51-14-95-69-95z" fill="#ed3e48"/><path d="M72 176c4-24 51-30 64 0l8 27H64z" fill="#fff6ed"/><ellipse cx="72" cy="115" rx="28" ry="34" fill="#fff6ed"/><ellipse cx="132" cy="115" rx="28" ry="34" fill="#fff6ed"/><ellipse cx="76" cy="119" rx="16" ry="23" fill="#513035"/><ellipse cx="128" cy="119" rx="16" ry="23" fill="#513035"/><circle cx="80" cy="110" r="7" fill="white"/><circle cx="132" cy="110" r="7" fill="white"/><path d="M91 142q11-12 23 0l-12 19z" fill="#ffbd48"/><path d="M44 158q-14 22 0 34M164 158q14 22 0 34" stroke="#c52b3d" strokeWidth="8" strokeLinecap="round" fill="none"/><path d="M73 48l29-12 30 12-30 12z" fill="#f6be51"/><path d="M83 52v13q19 9 39 0V52" fill="#f6be51"/><path d="M159 38l4-8 4 8 9 1-7 6 2 9-8-4-8 4 2-9-7-6z" fill="none" stroke="#e995a1" strokeWidth="2"/></svg>;
}

export function Dashboard({ user, onLogout }: { user: User; onLogout: () => Promise<void> }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [form, setForm] = useState<Profile | null>(null);
  const [coach, setCoach] = useState<Coach | null>(null);
  const [report, setReport] = useState<Report | null>(null);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [sidebar, setSidebar] = useState(false);
  const [dark, setDark] = useState(false);
  const [tour, setTour] = useState(false);
  const [announcement, setAnnouncement] = useState(true);
  const [showProfile, setShowProfile] = useState(false);
  const [guide, setGuide] = useState(true);
  useEffect(() => {
    if (!tour && !showProfile) return;
    const dialog = document.querySelector<HTMLElement>(".workspace-modal");
    const trapFocus = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setTour(false); setShowProfile(false); }
      if (event.key !== "Tab" || !dialog) return;
      const controls = Array.from(dialog.querySelectorAll<HTMLElement>("a[href], button:not(:disabled), input, select, [tabindex='0']"));
      const first = controls[0]; const last = controls.at(-1);
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    };
    document.addEventListener("keydown", trapFocus);
    return () => document.removeEventListener("keydown", trapFocus);
  }, [tour, showProfile]);
  useEffect(() => {
    setDark(localStorage.getItem("ielts-theme") === "dark");
    Promise.allSettled([
      api<{ profile: Profile }>("/api/profile").then(x => { setProfile(x.profile); setForm(x.profile); }),
      api<Coach>("/api/coach/dashboard").then(setCoach),
      api<Report>("/api/reports/progress").then(setReport),
    ]).then(results => { const failed = results.filter(x => x.status === "rejected"); if (failed.length) setMessage("Some progress data could not load. Please refresh to try again."); });
  }, []);
  const overall = coach?.bandPrediction ?? profile?.currentLevel ?? null;
  const skillBand = (skill: string) => skill === "Writing" ? report?.skills.writing : skill === "Speaking" ? report?.skills.speaking : null;
  const completed = coach?.tasks.filter(t => t.status === "completed").length ?? 0;
  const greeting = new Intl.DateTimeFormat("en", { timeZone: "Asia/Dhaka", hour: "numeric", hour12: false }).format(new Date());
  const dates = Array.from({ length: 14 }, (_, i) => { const d = new Date(); d.setDate(d.getDate() - 13 + i); return d; });
  const save = async (e: React.FormEvent) => {
    e.preventDefault(); if (!form) return; setSaving(true); setMessage("");
    try { const { profile: saved } = await api<{ profile: Profile }>("/api/profile", { method: "PUT", body: JSON.stringify(form) }); setProfile(saved); setForm(saved); setMessage("Profile saved successfully."); }
    catch (e) { setMessage(e instanceof Error ? e.message : "Could not save profile"); }
    finally { setSaving(false); }
  };
  return <div className={`student-workspace ${dark ? "dark-workspace" : ""}`}>
    <a className="workspace-skip" href="#dashboard-main">Skip to dashboard content</a>
    {sidebar && <button className="sidebar-backdrop" onClick={() => setSidebar(false)} aria-label="Close navigation"/>}
    <aside className={`workspace-sidebar ${sidebar ? "sidebar-open" : ""}`} aria-label="Dashboard navigation">
      <div className="sidebar-brand"><a href="/">IELTS<span>coach</span><sup>AI</sup></a><button className="sidebar-close" onClick={() => setSidebar(false)} aria-label="Close navigation"><Icon name="close"/></button></div>
      <WorkspaceNavigation path="/" close={()=>setSidebar(false)} staff={user.role !== "student"}/>
      <div className="sidebar-account"><div className="sidebar-language"><span>🇬🇧 <span><small>LANGUAGE</small>English</span></span><button onClick={() => {setDark(!dark);localStorage.setItem("ielts-theme",dark?"light":"dark");}} aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}><Icon name="moon"/></button></div><button className="account-profile" onClick={() => { setShowProfile(true); setSidebar(false); }}><span className="user-avatar">{user.name[0].toUpperCase()}</span><span><b>{user.name}</b><small>IELTS AI Coach member</small></span><span className="profile-edit">↗</span></button><button className="logout-button" onClick={async () => { try { await onLogout(); } catch { setMessage("Could not log out. Please try again."); } }}>Log out</button></div>
    </aside>
    <main className="workspace-main" id="dashboard-main"><button className="mobile-nav-toggle" onClick={() => setSidebar(true)} aria-label="Open navigation"><Icon name="menu"/></button>
      <header className="workspace-heading"><div><small>GOOD {Number(greeting) < 12 ? "MORNING" : Number(greeting) < 18 ? "AFTERNOON" : "EVENING"}</small><h1>Welcome back, {user.name.split(" ")[0]}!</h1><p>A little practice today. A step closer to your dream score.</p></div><div><button className="workspace-button" onClick={() => document.getElementById("workspace-update")?.scrollIntoView({ behavior: "smooth", block: "center" })}>⚑ What’s new <i>1</i></button><a className="workspace-button" href="/coach"><Icon name="calendar"/>View study plan</a></div></header>
      {message && <div role="status" className="workspace-message">{message}</div>}
      <div className="workspace-stats"><Stat label="Estimated current overall" value={overall ?? "—"} unit="/ 9" hint={coach?.bandPrediction ? "Estimated from available skill scores" : "Your self-reported starting level"} icon="target" color="rose"/><Stat label="Study activity" value={coach?.studyStreak ?? "—"} unit="days" hint="Active study days in the last 30 days" icon="flame" color="amber"/><Stat label="Daily study goal" value={profile?.dailyStudyMinutes ?? "—"} unit="min" hint="Make time for your next step" icon="clock" color="green"/><Stat label="Target band" value={profile?.targetBand ?? "—"} unit="/ 9" hint={coach?.examCountdown != null ? `${coach.examCountdown} days until your exam` : "Your destination, your pace"} icon="bolt" color="purple"/></div>
      <div className="workspace-columns"><div className="workspace-primary">
        {guide && <section className="dashboard-tour"><button className="panel-dismiss" aria-label="Dismiss guide" onClick={() => setGuide(false)}><Icon name="close"/></button><button className="tour-thumbnail" aria-label="Open dashboard guide" onClick={() => setTour(true)}><span>IELTScoach</span><i>▶</i><small>QUICK GUIDE</small></button><div><span className="new-badge">◎ NEW HERE?</span><h3>Take a quick dashboard tour</h3><p>Learn your study plan, practice library, and progress tools in one walkthrough.</p><div className="tour-actions"><button className="workspace-primary-button" onClick={() => setTour(true)}>ⓘ Explore the guide</button><a href="/onboarding">Set up your profile <Icon name="arrow"/></a></div></div></section>}
        {announcement && <section className="dashboard-announcement" id="workspace-update"><button className="panel-dismiss" aria-label="Dismiss announcement" onClick={() => setAnnouncement(false)}><Icon name="close"/></button><small>NEW · COMPLETELY FREE</small><h3>Your Free Content Library is here</h3><p>Explore 11 IELTS learning modules with YouTube lessons and Bengali study notes. Save your own notes and track your learning progress — no subscription needed.</p><a href="/dashboard/content-library">Explore the free library <Icon name="arrow"/></a></section>}
        <section className="dashboard-dream"><div><small>YOUR NEXT CHAPTER</small><h2>Big dreams.<br/>Small daily steps.</h2><p>Your next band starts with today’s practice. Let’s make it count, together.</p><a className="workspace-primary-button" href="/coach">Continue learning <Icon name="arrow"/></a></div><CoachMascot/></section>
        <section className="skill-section"><div className="dashboard-section-title"><div><h2>Make time for your skills</h2><p>Four skills. One step closer to your goal.</p></div><a href="/dashboard/mock-tests">All tests <Icon name="arrow"/></a></div><div className="dashboard-skills">{skillItems.map(([name,icon,color]) => <a className={`dashboard-skill ${color}`} key={name} href={`/practice/${name.toLowerCase()}`}><span className="skill-icon"><Icon name={icon}/></span><h3>{name}</h3><p>Current band · {skillBand(name) ?? "—"}</p><span className="skill-action">Practice <Icon name="arrow"/></span></a>)}</div></section>
        <section className="workspace-panel"><div className="dashboard-section-title"><div><h2>Today’s Tasks</h2><p>Your tasks for today ({completed}/{coach?.tasks.length ?? 0} completed)</p></div><a href="/coach">View plan</a></div>{coach?.tasks.length ? coach.tasks.map(t => <div className="dashboard-task" key={t.id}><span className="task-icon"><Icon name="pen"/></span><div><h3>{t.taskDescription}</h3><p>{t.taskType.replaceAll("_", " ")} · <Icon name="clock"/> {t.duration} min</p></div><a href="/coach">{t.status === "completed" ? "Completed ✓" : "Start →"}</a></div>) : <div className="dashboard-empty"><Icon name="calendar"/><p>Ready for a focused day? Generate your personal study plan.</p><a className="workspace-primary-button" href="/coach">Create my plan <Icon name="arrow"/></a></div>}</section>
        <section className="workspace-panel coach-guidance"><div className="dashboard-section-title"><div><h2>✦ A little guidance from your coach</h2><p>Personalized insights for your next step</p></div></div><p>{coach?.recommendations[0]?.reason ?? "Complete a practice session and review your feedback to discover what to focus on next."}</p><div><span>Estimated current band: {overall ?? "—"}</span><a href="/coach">Open coach <Icon name="arrow"/></a></div></section>
        <section className="workspace-panel dashboard-feedback"><span className="new-badge">✦ YOUR VOICE MATTERS</span><h2>Suggest a feature</h2><p>Missing something for your IELTS prep? Tell us what you’d like us to build.</p><a className="workspace-button" href="/beta">Share feedback <Icon name="arrow"/></a></section>
      </div><div className="workspace-secondary"><section className="workspace-panel progress-panel"><h2>Your progress</h2><p>Small steps. Measurable progress.</p><div className="overall-progress"><div className="score-ring" style={{ background: `conic-gradient(#eb2544 ${Number(overall ?? 0) / 9 * 360}deg, var(--workspace-line) 0deg)` }}><div><strong>{overall ?? "—"}</strong><small>out of 9.0</small></div></div><div><b>Estimated current<br/>overall</b><p>{coach?.bandPrediction ? "Estimated from available skill scores" : "Starting level from your profile"}</p></div></div><div className="skill-progress">{skillItems.map(([name,icon,color]) => <div className={color} key={name}><div><span><Icon name={icon}/>{name}</span><b>{skillBand(name) ?? "—"}</b></div><small>{skillBand(name) != null ? "Latest evaluation" : "Practice to get your first score"}</small><progress aria-label={`${name} band`} max={9} value={Number(skillBand(name) ?? 0)}/></div>)}</div><a className="dashboard-text-link" href="/report">Explore your reports <Icon name="arrow"/></a></section>
      <section className="workspace-panel consistency-panel"><h2>Your consistency</h2><p>Your last 14 days of evaluations</p><div className="activity-grid">{dates.map(date => { const key = date.toLocaleDateString("en-CA"); const active = [...(report?.improvement.writing ?? []), ...(report?.improvement.speaking ?? [])].some(x => new Date(x.date).toLocaleDateString("en-CA") === key); return <span key={key} className={active ? "active" : ""} title={`${key}: ${active ? "Evaluated practice" : "No evaluated practice"}`}>{date.getDate()}</span>; })}</div><div className="activity-legend"><span><i/>Evaluated practice</span><span><i/>No activity</span></div></section>
      <section className="workspace-panel vocabulary-panel"><h2>Vocabulary</h2><p>A little better, one word at a time.</p><div><span>Words mastered</span><strong>{coach?.vocabulary.mastered ?? "—"}</strong></div><div><span>Due for review</span><strong>{coach?.vocabulary.due ?? "—"}</strong></div><a className="dashboard-text-link" href="/vocabulary">Review your words <Icon name="arrow"/></a></section>
      </div></div><footer className="workspace-footer"><span>A little better, every day.<br/><small>IELTS AI Coach · Your IELTS journey, made personal</small></span><button onClick={() => setTour(true)}>Quick guide ↗</button></footer>
    </main>
    {(tour || showProfile) && <div className="workspace-modal-backdrop" onClick={() => { setTour(false); setShowProfile(false); }}><section className="workspace-modal" role="dialog" aria-modal="true" aria-label={tour ? "Dashboard guide" : "Study profile"} onClick={e => e.stopPropagation()} onKeyDown={e => { if (e.key === "Escape") { setTour(false); setShowProfile(false); } }}><button className="panel-dismiss" autoFocus onClick={() => { setTour(false); setShowProfile(false); }} aria-label="Close dialog"><Icon name="close"/></button>{tour ? <><small>WELCOME TO YOUR WORKSPACE</small><h2>Your IELTS journey, made personal.</h2>{[["01","Set your destination","Add your target band, exam date, and daily study time.","/onboarding"],["02","Make a little time to practice","Choose Reading, Listening, Writing, or Speaking.","/practice/reading"],["03","Reflect and improve","Review your feedback and follow your study plan.","/feedback"]].map(([n,title,desc,href]) => <a className="guide-step" href={href} key={n}><span>{n}</span><div><h3>{title}</h3><p>{desc}</p></div><Icon name="arrow"/></a>)}</> : <><small>YOUR DESTINATION</small><h2>Set up your study profile</h2>{form ? <form className="study-profile-form" onSubmit={save}><label>Current IELTS level<input type="number" min="0" max="9" step="0.5" value={form.currentLevel ?? ""} onChange={e => setForm({ ...form, currentLevel: e.target.value ? Number(e.target.value) : null })}/></label><label>Target band<input type="number" min="0" max="9" step="0.5" value={form.targetBand ?? ""} onChange={e => setForm({ ...form, targetBand: e.target.value ? Number(e.target.value) : null })}/></label><label>Exam date<input type="date" value={form.examDate?.slice(0,10) ?? ""} onChange={e => setForm({ ...form, examDate: e.target.value || null })}/></label><label>Daily study minutes<input type="number" min="15" max="720" value={form.dailyStudyMinutes ?? ""} onChange={e => setForm({ ...form, dailyStudyMinutes: e.target.value ? Number(e.target.value) : null })}/></label><button className="workspace-primary-button" disabled={saving}>{saving ? "Saving…" : "Save profile"}</button><p role="status">{message}</p></form> : <p>Loading your profile…</p>}</>}</section></div>}
  </div>;
}

function Stat({ label, value, unit, hint, icon, color }: { label: string; value: number | string; unit: string; hint: string; icon: string; color: string }) {
  return <article className={`workspace-stat ${color}`}><div><span>{label}</span><i><Icon name={icon}/></i></div><strong>{value}<small>{unit}</small></strong><p>{hint}</p></article>;
}
