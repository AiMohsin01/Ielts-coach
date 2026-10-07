import "./globals.css";
import "./landing.css";
import "./workspace.css";
import "./library.css";
import type { Metadata } from "next";
import { PwaRegister } from "../components/pwa-register";
export const metadata: Metadata = { title: "IELTS AI Coach", description: "Your personalized path to IELTS confidence", manifest: "/manifest.webmanifest", appleWebApp: { capable: true, title: "IELTS Coach" } };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body><PwaRegister />{children}</body></html>; }
