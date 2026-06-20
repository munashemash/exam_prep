"use client";

import type { User } from "firebase/auth";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { calculateDashboardAnalytics } from "@/lib/dashboard-analytics";
import { getFirebaseServices, isFirebaseConfigured } from "@/lib/firebase";
import { useStudyStore } from "@/store/use-study-store";
import type {
  AnswerAttempt,
  ExamAttempt,
  RevisionRecord,
} from "@/types/progress";

type SyncStatus = "local" | "connecting" | "synced" | "offline" | "error";
type FirebaseContextValue = {
  user: User | null;
  loading: boolean;
  configured: boolean;
  syncStatus: SyncStatus;
};
const FirebaseContext = createContext<FirebaseContextValue>({
  user: null,
  loading: true,
  configured: isFirebaseConfigured,
  syncStatus: "local",
});

export function FirebaseProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(isFirebaseConfigured);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>("local");
  const [readyUserId, setReadyUserId] = useState<string | null>(null);
  const attempts = useStudyStore((state) => state.attempts);
  const revisions = useStudyStore((state) => state.revisions);
  const examAttempts = useStudyStore((state) => state.examAttempts);
  const mergeCloudData = useStudyStore((state) => state.mergeCloudData);

  useEffect(() => {
    if (!isFirebaseConfigured) {
      setLoading(false);
      return;
    }
    let active = true;
    let unsubscribe: (() => void) | undefined;
    void getFirebaseServices().then(async (services) => {
      if (!services || !active) {
        setLoading(false);
        return;
      }
      const { onAuthStateChanged } = await import("firebase/auth");
      unsubscribe = onAuthStateChanged(services.auth, (nextUser) => {
        if (!active) return;
        setUser(nextUser);
        setReadyUserId(null);
        setSyncStatus(nextUser ? "connecting" : "local");
        setLoading(false);
      });
    });
    return () => {
      active = false;
      unsubscribe?.();
    };
  }, []);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    void (async () => {
      try {
        const services = await getFirebaseServices();
        if (!services) return;
        const { doc, getDoc, setDoc, serverTimestamp } =
          await import("firebase/firestore");
        const [progress, history] = await Promise.all([
          getDoc(doc(services.db, "users", user.uid, "progress", "current")),
          getDoc(doc(services.db, "users", user.uid, "attempts", "history")),
        ]);
        if (cancelled) return;
        const progressData = progress.data() as
          | { attempts?: AnswerAttempt[]; revisions?: RevisionRecord[] }
          | undefined;
        const historyData = history.data() as
          | { examAttempts?: ExamAttempt[] }
          | undefined;
        mergeCloudData({ ...progressData, ...historyData });
        await setDoc(
          doc(services.db, "users", user.uid),
          {
            email: user.email,
            displayName: user.displayName,
            updatedAt: serverTimestamp(),
          },
          { merge: true },
        );
        if (!cancelled) {
          setReadyUserId(user.uid);
          setSyncStatus("synced");
        }
      } catch {
        if (!cancelled) setSyncStatus(navigator.onLine ? "error" : "offline");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [mergeCloudData, user]);

  useEffect(() => {
    if (!user || readyUserId !== user.uid) return;
    const sync = async () => {
      if (!navigator.onLine) {
        setSyncStatus("offline");
        return;
      }
      try {
        setSyncStatus("connecting");
        const services = await getFirebaseServices();
        if (!services) return;
        const { doc, setDoc, serverTimestamp } =
          await import("firebase/firestore");
        const analytics = calculateDashboardAnalytics(attempts);
        await Promise.all([
          setDoc(doc(services.db, "users", user.uid, "progress", "current"), {
            attempts,
            revisions,
            updatedAt: serverTimestamp(),
          }),
          setDoc(doc(services.db, "users", user.uid, "attempts", "history"), {
            examAttempts,
            updatedAt: serverTimestamp(),
          }),
          setDoc(doc(services.db, "users", user.uid, "statistics", "summary"), {
            questionsAnswered: analytics.questionsAnswered,
            correctAnswers: analytics.correctAnswers,
            overallAccuracy: analytics.overallAccuracy,
            updatedAt: serverTimestamp(),
          }),
        ]);
        setSyncStatus("synced");
      } catch {
        setSyncStatus(navigator.onLine ? "error" : "offline");
      }
    };
    const timer = window.setTimeout(() => void sync(), 900);
    const handleOnline = () => void sync();
    const handleOffline = () => setSyncStatus("offline");
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [attempts, examAttempts, readyUserId, revisions, user]);

  const value = useMemo(
    () => ({ user, loading, configured: isFirebaseConfigured, syncStatus }),
    [loading, syncStatus, user],
  );
  return (
    <FirebaseContext.Provider value={value}>
      {children}
    </FirebaseContext.Provider>
  );
}

export function useFirebase() {
  return useContext(FirebaseContext);
}
