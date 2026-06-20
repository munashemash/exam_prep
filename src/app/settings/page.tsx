"use client";
import { Bell, RotateCcw, SlidersHorizontal, Volume2 } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useStudyStore } from "@/store/use-study-store";
import { useMounted } from "@/hooks/use-mounted";
import { AccountCard } from "@/components/auth/account-card";

function SettingRow({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: typeof Bell;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-4 py-5">
      <span className="hidden size-9 shrink-0 place-items-center rounded-lg bg-secondary text-muted-foreground sm:grid">
        <Icon className="size-4" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium">{title}</p>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">
          {description}
        </p>
      </div>
      {children}
    </div>
  );
}
export default function SettingsPage() {
  const mounted = useMounted();
  const {
    dailyGoal,
    soundEnabled,
    reducedMotion,
    setDailyGoal,
    setSoundEnabled,
    setReducedMotion,
  } = useStudyStore();
  if (!mounted)
    return <div className="h-96 animate-pulse rounded-xl bg-card" />;
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Preferences"
        title="Settings"
        description="Tune the practice environment to match how you study best."
      />
      <AccountCard />
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <Card>
          <CardHeader>
            <CardTitle>Study preferences</CardTitle>
            <CardDescription>Saved locally on this device.</CardDescription>
          </CardHeader>
          <CardContent>
            <SettingRow
              icon={SlidersHorizontal}
              title="Daily question goal"
              description="The target shown on your dashboard."
            >
              <select
                aria-label="Daily question goal"
                value={dailyGoal}
                onChange={(event) => setDailyGoal(Number(event.target.value))}
                className="h-10 rounded-md border bg-background px-3 text-sm outline-none ring-offset-background focus:ring-2 focus:ring-ring"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={30}>30</option>
                <option value={40}>40</option>
              </select>
            </SettingRow>
            <Separator />
            <SettingRow
              icon={Volume2}
              title="Interface sounds"
              description="Play subtle feedback sounds during practice."
            >
              <Switch
                checked={soundEnabled}
                onCheckedChange={setSoundEnabled}
                aria-label="Toggle interface sounds"
              />
            </SettingRow>
            <Separator />
            <SettingRow
              icon={Bell}
              title="Reduced motion"
              description="Minimise non-essential interface animation."
            >
              <Switch
                checked={reducedMotion}
                onCheckedChange={setReducedMotion}
                aria-label="Toggle reduced motion"
              />
            </SettingRow>
          </CardContent>
        </Card>
        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="text-base">Reset progress</CardTitle>
            <CardDescription>
              This clears local practice history and preferences.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="destructive" className="w-full">
              <RotateCcw className="size-4" />
              Reset all data
            </Button>
            <p className="mt-3 text-center text-xs text-muted-foreground">
              This action cannot be undone.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
