"use client";
import { FirebaseProvider } from "@/components/auth/firebase-provider";
import { ServiceWorkerRegistration } from "@/components/pwa/service-worker-registration";
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <FirebaseProvider>
      {children}
      <ServiceWorkerRegistration />
    </FirebaseProvider>
  );
}
