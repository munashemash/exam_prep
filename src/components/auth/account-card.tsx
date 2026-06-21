"use client";

import { useState } from "react";
import { Cloud, LogIn, LogOut } from "lucide-react";
import { useFirebase } from "@/components/auth/firebase-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getFirebaseServices } from "@/lib/firebase";

export function AccountCard() {
  const { user, loading, configured, syncStatus } = useFirebase();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const runAuth = async (action: "google" | "signout") => {
    setBusy(true);
    setError(null);
    try {
      const services = await getFirebaseServices();
      if (!services) throw new Error("Firebase is not configured or available.");
      const {
        browserLocalPersistence,
        GoogleAuthProvider,
        setPersistence,
        signInWithPopup,
        signOut,
      } = await import("firebase/auth");
      await setPersistence(services.auth, browserLocalPersistence);
      if (action === "google") {
        await signInWithPopup(services.auth, new GoogleAuthProvider());
      } else {
        await signOut(services.auth);
      }
    } catch (caught) {
      setError(
        caught instanceof Error ? caught.message : "Authentication failed.",
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle>Cloud synchronization</CardTitle>
            <CardDescription className="mt-2">
              Sign in with Google to merge and sync progress across devices.
            </CardDescription>
          </div>
          <Cloud className="size-5 text-primary" aria-hidden="true" />
        </div>
      </CardHeader>
      <CardContent aria-busy={busy}>
        <span className="sr-only" role="status" aria-live="polite">
          {busy ? "Authentication in progress" : ""}
        </span>
        {!configured ? (
          <div className="rounded-lg border border-amber-400/20 bg-amber-400/5 p-4 text-sm text-muted-foreground">
            Firebase is not configured. All features remain available locally
            and offline.
          </div>
        ) : loading ? (
          <p className="text-sm text-muted-foreground" role="status">
            Checking authentication&hellip;
          </p>
        ) : user ? (
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium">
                {user.displayName ?? user.email}
              </p>
              <div className="mt-2 flex items-center gap-2">
                <Badge variant="secondary">{syncStatus}</Badge>
                <span className="text-xs text-muted-foreground">
                  Local and cloud progress enabled
                </span>
              </div>
            </div>
            <Button
              variant="outline"
              disabled={busy}
              onClick={() => void runAuth("signout")}
            >
              <LogOut className="size-4" aria-hidden="true" />
              Sign out
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm leading-6 text-muted-foreground">
              You can continue anonymously. Signing in uploads and merges the
              progress already saved on this device.
            </p>
            <Button disabled={busy} onClick={() => void runAuth("google")}>
              <LogIn className="size-4" aria-hidden="true" />
              Continue with Google
            </Button>
          </div>
        )}
        {error && (
          <p role="alert" className="mt-4 text-xs text-red-400">
            {error}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
