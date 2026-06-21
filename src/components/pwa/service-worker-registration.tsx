"use client";

import { useEffect } from "react";

type SyncRegistration = ServiceWorkerRegistration & {
  sync?: { register: (tag: string) => Promise<void> };
};

export function ServiceWorkerRegistration() {
  useEffect(() => {
    if (
      !("serviceWorker" in navigator) ||
      process.env.NODE_ENV !== "production"
    )
      return;

    const register = async () => {
      const registration = (await navigator.serviceWorker.register("/sw.js", {
        scope: "/",
      })) as SyncRegistration;
      if ("sync" in registration && registration.sync) {
        await registration.sync.register("cos332-sync").catch(() => undefined);
      }
    };

    const handleMessage = (event: MessageEvent<{ type?: string }>) => {
      if (event.data?.type === "COS332_SYNC") {
        window.dispatchEvent(new Event("online"));
      }
    };

    void register();
    navigator.serviceWorker.addEventListener("message", handleMessage);
    return () =>
      navigator.serviceWorker.removeEventListener("message", handleMessage);
  }, []);

  return null;
}
