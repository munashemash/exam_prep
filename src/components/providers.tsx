"use client";
import { FirebaseProvider } from "@/components/auth/firebase-provider";
export function Providers({ children }: { children: React.ReactNode }) {
  return <FirebaseProvider>{children}</FirebaseProvider>;
}
