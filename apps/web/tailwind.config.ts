import type { Config } from "tailwindcss";
export default { content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"], theme: { extend: { colors: { ink: "#3f0d12", ocean: "#b91c1c", mist: "#fef2f2", coral: "#f87171" } } }, plugins: [] } satisfies Config;
