import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function StatCard({
  label,
  value,
  note,
  icon: Icon,
}: {
  label: string;
  value: string;
  note: string;
  icon: LucideIcon;
}) {
  return (
    <Card className="bg-card/60">
      <CardContent className="p-5">
        <div className="mb-5 flex items-center justify-between">
          <span className="text-sm text-muted-foreground">{label}</span>
          <span className="grid size-9 place-items-center rounded-lg bg-secondary text-primary">
            <Icon className="size-4" />
          </span>
        </div>
        <p className="text-2xl font-semibold tracking-tight">{value}</p>
        <p className="mt-1 text-xs text-muted-foreground">{note}</p>
      </CardContent>
    </Card>
  );
}
