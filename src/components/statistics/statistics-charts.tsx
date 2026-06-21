"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const tooltipStyle = {
  backgroundColor: "hsl(222 38% 8%)",
  border: "1px solid hsl(217 22% 17%)",
  borderRadius: "8px",
  fontSize: "12px",
};

type StatisticsChartsProps = {
  topicAccuracy: { topic: string; accuracy: number; answered: number }[];
  activity: { day: string; questions: number }[];
};

export function StatisticsCharts({
  topicAccuracy,
  activity,
}: StatisticsChartsProps) {
  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <ChartCard
        title="Accuracy by topic"
        description="Correct answers as a percentage of attempts."
      >
        <BarChart
          data={topicAccuracy}
          accessibilityLayer
          margin={{ left: 0, right: 8, top: 8 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="hsl(var(--border))"
            vertical={false}
          />
          <XAxis
            dataKey="topic"
            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
            tickLine={false}
            axisLine={false}
            interval={0}
            angle={-25}
            textAnchor="end"
            height={75}
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip contentStyle={tooltipStyle} />
          <Bar
            dataKey="accuracy"
            name="Accuracy %"
            fill="hsl(var(--primary))"
            radius={[5, 5, 0, 0]}
          />
        </BarChart>
      </ChartCard>
      <ChartCard
        title="Questions answered over time"
        description="Activity during the last 14 days."
      >
        <LineChart
          data={activity}
          accessibilityLayer
          margin={{ left: 0, right: 12, top: 8 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="hsl(var(--border))"
            vertical={false}
          />
          <XAxis
            dataKey="day"
            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            allowDecimals={false}
            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip contentStyle={tooltipStyle} />
          <Line
            type="monotone"
            dataKey="questions"
            name="Questions"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            dot={{ fill: "hsl(var(--primary))", r: 3 }}
          />
        </LineChart>
      </ChartCard>
    </div>
  );
}

function ChartCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactElement;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-72 w-full" aria-label={title}>
          <ResponsiveContainer width="100%" height="100%">
            {children}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
