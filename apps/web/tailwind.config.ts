import type { Config } from "tailwindcss";
export default { content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"], theme: { extend: { colors: { ink: "#10233f", ocean: "#0f6e8c", mist: "#edf5f7", coral: "#f26b5b" } } }, plugins: [] } satisfies Config;
