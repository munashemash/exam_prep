import {
  ArrowRight,
  BarChart3,
  BookOpenCheck,
  MousePointerClick,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const steps = [
  {
    icon: BookOpenCheck,
    title: "Choose a topic",
    description: "Start with a focused set from the COS332 question bank.",
  },
  {
    icon: MousePointerClick,
    title: "Answer questions",
    description: "Each submitted answer is saved locally on this device.",
  },
  {
    icon: BarChart3,
    title: "Use your analytics",
    description: "Return here to target topics that fall below 80%.",
  },
];
export function OnboardingCard() {
  return (
    <Card className="overflow-hidden border-primary/25">
      <CardContent className="p-0">
        <div className="bg-primary/10 p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            Start here
          </p>
          <h2 className="mt-2 text-2xl font-semibold">
            Build your first performance baseline
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
            You have not answered any questions yet. Complete a short practice
            set and this dashboard will calculate your accuracy, weak topics,
            and next recommendation automatically.
          </p>
          <Button asChild className="mt-6">
            <Link href="/practice" prefetch={false}>
              Start your first practice set <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
        <div className="grid gap-px bg-border md:grid-cols-3">
          {steps.map((step, index) => (
            <div key={step.title} className="bg-card p-6">
              <div className="flex items-center gap-3">
                <span className="grid size-8 place-items-center rounded-lg bg-secondary text-primary">
                  <step.icon className="size-4" />
                </span>
                <span className="text-xs text-muted-foreground">
                  0{index + 1}
                </span>
              </div>
              <h3 className="mt-4 text-sm font-semibold">{step.title}</h3>
              <p className="mt-2 text-xs leading-5 text-muted-foreground">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
