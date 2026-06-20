import type { Metadata } from "next";
import { StatisticsDashboard } from "@/components/statistics/statistics-dashboard";

export const metadata: Metadata = { title: "Statistics" };

export default function StatisticsPage() {
  return <StatisticsDashboard />;
}
