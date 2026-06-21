"use client";

import { useState } from "react";
import { Cloud, LogOut, Mail } from "lucide-react";
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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const runAuth = async (
    action: "signin" | "signup" | "google" | "signout",
  ) => {
    setBusy(true);
    setError(null);
    try {
      const services = await getFirebaseServices();
      if (!services) throw new Error("Firebase is not configured.");
      const authApi = await import("firebase/auth");
      if (action === "google")
        await authApi.signInWithPopup(
          services.auth,
          new authApi.GoogleAuthProvider(),
        );
      if (action === "signin")
        await authApi.signInWithEmailAndPassword(
          services.auth,
          email,
          password,
        );
      if (action === "signup")
        await authApi.createUserWithEmailAndPassword(
          services.auth,
          email,
          password,
        );
      if (action === "signout") await authApi.signOut(services.auth);
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
              Sign in to sync progress, exams, and statistics across devices.
            </CardDescription>
          </div>
          <Cloud className="size-5 text-primary" />
        </div>
      </CardHeader>
      <CardContent>
        {!configured ? (
          <div className="rounded-lg border border-amber-400/20 bg-amber-400/5 p-4 text-sm text-muted-foreground">
            Firebase environment variables are not configured. All features
            remain available with localStorage.
          </div>
        ) : loading ? (
          <p className="text-sm text-muted-foreground">
            Checking authentication…
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
                  Automatic sync enabled
                </span>
              </div>
            </div>
            <Button
              variant="outline"
              disabled={busy}
              onClick={() => void runAuth("signout")}
            >
              <LogOut className="size-4" />
              Sign out
            </Button>
          </div>
        ) : (
          <div className="space-y-4" aria-busy={busy}>
            <span className="sr-only" role="status" aria-live="polite">
              {busy ? "Authentication in progress" : ""}
            </span>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="grid gap-1.5 text-xs text-muted-foreground">
                Email
                <input
                  type="email"
                  name="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="h-10 rounded-md border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
                />
              </label>
              <label className="grid gap-1.5 text-xs text-muted-foreground">
                Password
                <input
                  type="password"
                  name="password"
                  required
                  autoComplete="current-password"
                  minLength={6}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="h-10 rounded-md border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
                />
              </label>
            </div>
            {error && (
              <p role="alert" className="text-xs text-red-400">
                {error}
              </p>
            )}
            <div className="flex flex-wrap gap-2">
              <Button
                disabled={busy || !email || password.length < 6}
                onClick={() => void runAuth("signin")}
              >
                <Mail className="size-4" />
                Sign in
              </Button>
              <Button
                variant="outline"
                disabled={busy || !email || password.length < 6}
                onClick={() => void runAuth("signup")}
              >
                Create account
              </Button>
              <Button
                variant="secondary"
                disabled={busy}
                onClick={() => void runAuth("google")}
              >
                Continue with Google
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
