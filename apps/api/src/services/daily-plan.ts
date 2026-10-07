export type PlanTask = { type: string; description: string; duration: number; priority: number };
export const studyDate = (now = new Date()) => now.toLocaleDateString("en-CA", { timeZone: "Asia/Dhaka" });
export function buildDailyPlan(minutes: number, weakSkills: string[] = [], scores: Record<string, number> = {}): PlanTask[] {
  if (!Number.isInteger(minutes) || minutes < 15 || minutes > 720) throw new Error("Choose 15–720 study minutes");
  const skills = ["writing", "speaking", "reading", "listening"];
  skills.sort((a, b) => Number(weakSkills.includes(b)) - Number(weakSkills.includes(a)) || (scores[a] ?? 5) - (scores[b] ?? 5));
  const primary = Math.min(60, Math.max(10, Math.round(minutes * .5)));
  const tasks: PlanTask[] = [{ type: skills[0], description: skills[0] + " focused practice: build confidence in your priority skill.", duration: primary, priority: 1 }];
  let remaining = minutes - primary;
  if (remaining >= 5) {
    const duration = Math.min(20, remaining);
    tasks.push({ type: "vocabulary", description: "Academic vocabulary flashcard review and active recall.", duration, priority: 2 });
    remaining -= duration;
  }
  if (remaining >= 15) {
    const duration = Math.min(20, remaining);
    tasks.push({ type: "grammar", description: "Review a grammar lesson and practise accurate sentences.", duration, priority: 3 });
    remaining -= duration;
  }
  for (let i = 1; remaining >= 5; i++) {
    const duration = Math.min(120, remaining);
    const skill = skills[i % skills.length];
    tasks.push({ type: skill, description: "Balanced " + skill + " practice, session " + i + ".", duration, priority: 4 });
    remaining -= duration;
  }
  if (remaining) tasks[tasks.length - 1].duration += remaining;
  return tasks;
}
