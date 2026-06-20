import Link from "next/link";
import { Button } from "@/components/ui/button";
export default function NotFound() {
  return (
    <div className="grid min-h-[60vh] place-items-center text-center">
      <div>
        <p className="text-sm font-semibold text-primary">404</p>
        <h1 className="mt-2 text-3xl font-semibold">Page not found</h1>
        <p className="mt-3 text-muted-foreground">
          This study page does not exist.
        </p>
        <Button asChild className="mt-6">
          <Link href="/">Return to dashboard</Link>
        </Button>
      </div>
    </div>
  );
}
