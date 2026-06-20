"use client";

import * as Dialog from "@radix-ui/react-dialog";
import {
  BarChart3,
  BookOpenCheck,
  BrainCircuit,
  Clock3,
  FilePenLine,
  LayoutDashboard,
  Menu,
  Settings,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { NavItem } from "@/types";

const navigation: NavItem[] = [
  { title: "Dashboard", href: "/", icon: LayoutDashboard },
  { title: "Practice", href: "/practice", icon: BookOpenCheck },
  { title: "Mock Exam", href: "/mock-exam", icon: Clock3 },
  { title: "Long Questions", href: "/long-questions", icon: FilePenLine },
  { title: "Statistics", href: "/statistics", icon: BarChart3 },
  { title: "Settings", href: "/settings", icon: Settings },
];

function Brand() {
  return (
    <Link href="/" className="flex items-center gap-2.5">
      <span className="grid size-9 place-items-center rounded-lg bg-primary text-primary-foreground">
        <BrainCircuit className="size-5" />
      </span>
      <span>
        <span className="block text-sm font-semibold leading-none">COS332</span>
        <span className="text-[11px] text-muted-foreground">Practice Hub</span>
      </span>
    </Link>
  );
}

function NavLinks({ mobile = false }: { mobile?: boolean }) {
  const pathname = usePathname();
  return (
    <nav
      className={cn("flex", mobile ? "flex-col gap-1" : "items-center gap-1")}
    >
      {navigation.map((item) => {
        const active =
          item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
              active
                ? "bg-secondary text-foreground"
                : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground",
            )}
          >
            <item.icon className="size-4" />
            {item.title}
          </Link>
        );
      })}
    </nav>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-4 sm:px-6">
          <Brand />
          <div className="hidden lg:block">
            <NavLinks />
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden rounded-full border bg-card px-3 py-1.5 text-xs text-muted-foreground sm:flex sm:items-center sm:gap-2">
              <span className="size-1.5 rounded-full bg-primary" />
              12 day streak
            </div>
            <Dialog.Root>
              <Dialog.Trigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden"
                  aria-label="Open navigation"
                >
                  <Menu className="size-5" />
                </Button>
              </Dialog.Trigger>
              <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm" />
                <Dialog.Content className="fixed inset-y-0 right-0 z-50 w-[min(88vw,360px)] border-l bg-background p-6 shadow-2xl">
                  <div className="mb-10 flex items-center justify-between">
                    <Brand />
                    <Dialog.Close asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Close navigation"
                      >
                        <X className="size-5" />
                      </Button>
                    </Dialog.Close>
                  </div>
                  <Dialog.Close asChild>
                    <div>
                      <NavLinks mobile />
                    </div>
                  </Dialog.Close>
                  <div className="absolute bottom-6 left-6 right-6 rounded-lg border bg-card p-4">
                    <p className="text-sm font-medium">Keep the momentum</p>
                    <p className="mt-1 text-xs leading-5 text-muted-foreground">
                      You are 8 questions away from today&apos;s goal.
                    </p>
                  </div>
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-[1440px] flex-1 px-4 py-8 sm:px-6 sm:py-10 lg:py-12">
        {children}
      </main>
      <footer className="border-t">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-2 px-4 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>© 2026 COS332 Practice Hub</p>
          <p>Built for focused database systems study.</p>
        </div>
      </footer>
    </div>
  );
}
