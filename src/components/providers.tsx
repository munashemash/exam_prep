"use client";
import { FirebaseProvider } from "@/components/auth/firebase-provider";
import { AccessibilityPreferences } from "@/components/accessibility-preferences";
import { ServiceWorkerRegistration } from "@/components/pwa/service-worker-registration";
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <FirebaseProvider>
      {children}
      <AccessibilityPreferences />
      <ServiceWorkerRegistration />
    </FirebaseProvider>
  );
}
