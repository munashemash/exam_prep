"use client";

import type { User } from "firebase/auth";
import { usePathname } from "next/navigation";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
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
type CloudProgress = {
  attempts?: AnswerAttempt[];
  revisions?: RevisionRecord[];
};

const FirebaseContext = createContext<FirebaseContextValue>({
  user: null,
  loading: true,
  configured: isFirebaseConfigured,
  syncStatus: "local",
});

function isExamAttempt(value: unknown): value is ExamAttempt {
  if (!value || typeof value !== "object") return false;
  const attempt = value as Partial<ExamAttempt>;
  return (
    typeof attempt.id === "string" &&
    typeof attempt.startedAt === "string" &&
    typeof attempt.completedAt === "string" &&
    Array.isArray(attempt.answers)
  );
}

export function FirebaseProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
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
    const initialize = async () => {
      try {
        const services = await getFirebaseServices();
        if (!services || !active) {
          if (active) setLoading(false);
          return;
        }
        const { browserLocalPersistence, onAuthStateChanged, setPersistence } =
          await import("firebase/auth");
        await setPersistence(services.auth, browserLocalPersistence);
        if (!active) return;
        unsubscribe = onAuthStateChanged(services.auth, (nextUser) => {
          if (!active) return;
          setUser(nextUser);
          setReadyUserId(null);
          setSyncStatus(nextUser ? "connecting" : "local");
          setLoading(false);
        });
      } catch {
        if (!active) return;
        setUser(null);
        setLoading(false);
        setSyncStatus(navigator.onLine ? "error" : "offline");
      }
    };

    // Authentication is immediately relevant on Settings. Elsewhere, defer
    // the cloud SDK so it cannot block the study UI's initial interaction.
    const timer =
      pathname === "/settings"
        ? undefined
        : window.setTimeout(() => void initialize(), 15_000);
    if (pathname === "/settings") void initialize();

    return () => {
      active = false;
      if (timer !== undefined) window.clearTimeout(timer);
      unsubscribe?.();
    };
  }, [pathname]);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;

    void (async () => {
      try {
        const services = await getFirebaseServices();
        if (!services) {
          if (!cancelled) setSyncStatus("local");
          return;
        }
        const {
          collection,
          doc,
          getDoc,
          getDocs,
          serverTimestamp,
          setDoc,
        } = await import("firebase/firestore");
        const [progressSnapshot, examSnapshots] = await Promise.all([
          getDoc(doc(services.db, "users", user.uid, "progress", "main")),
          getDocs(collection(services.db, "users", user.uid, "attempts")),
        ]);
        if (cancelled) return;

        const progress = progressSnapshot.data() as CloudProgress | undefined;
        const cloudExamAttempts = examSnapshots.docs
          .map((snapshot) => snapshot.data() as unknown)
          .filter(isExamAttempt);

        // Zustand updates synchronously, so this snapshot contains the union
        // of localStorage and Firestore records. Local records are never lost.
        mergeCloudData({ ...progress, examAttempts: cloudExamAttempts });
        const merged = useStudyStore.getState();

        await Promise.all([
          setDoc(
            doc(services.db, "users", user.uid, "progress", "main"),
            {
              attempts: merged.attempts,
              revisions: merged.revisions,
              updatedAt: serverTimestamp(),
            },
            { merge: true },
          ),
          ...merged.examAttempts.map((attempt) =>
            setDoc(
              doc(services.db, "users", user.uid, "attempts", attempt.id),
              { ...attempt, updatedAt: serverTimestamp() },
              { merge: true },
            ),
          ),
          setDoc(
            doc(services.db, "users", user.uid),
            {
              email: user.email,
              displayName: user.displayName,
              updatedAt: serverTimestamp(),
            },
            { merge: true },
          ),
        ]);

        if (!cancelled) {
          setReadyUserId(user.uid);
          setSyncStatus(navigator.onLine ? "synced" : "offline");
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
        if (!services) {
          setSyncStatus("local");
          return;
        }
        const { doc, serverTimestamp, setDoc } =
          await import("firebase/firestore");
        await Promise.all([
          setDoc(
            doc(services.db, "users", user.uid, "progress", "main"),
            { attempts, revisions, updatedAt: serverTimestamp() },
            { merge: true },
          ),
          ...examAttempts.map((attempt) =>
            setDoc(
              doc(services.db, "users", user.uid, "attempts", attempt.id),
              { ...attempt, updatedAt: serverTimestamp() },
              { merge: true },
            ),
          ),
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
