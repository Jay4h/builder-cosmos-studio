import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function TrainingPage() {
  const [data, setData] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const { api } = await import("@/lib/apiClient");
        const analytics = await api.getAnalytics();
        setData(analytics);
      } catch (e: any) {
        setError("Backend not configured. Set BACKEND_BASE_URL.");
      }
    };
    load();
  }, []);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-display text-xl">Training Overview</CardTitle>
        </CardHeader>
        <CardContent>
          {error && <div className="text-sm text-destructive">{error}</div>}
          {!data && !error && <div className="text-sm text-muted-foreground">Loading…</div>}
          {data && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-md border p-4">
                <div className="text-xs text-muted-foreground">Completed</div>
                <div className="text-2xl font-semibold">{data.training_distribution?.[1] ?? 0}</div>
              </div>
              <div className="rounded-md border p-4">
                <div className="text-xs text-muted-foreground">Failed</div>
                <div className="text-2xl font-semibold">{data.training_distribution?.[0] ?? 0}</div>
              </div>
              <div className="rounded-md border p-4">
                <div className="text-xs text-muted-foreground">In Progress</div>
                <div className="text-2xl font-semibold">{data.training_distribution?.[2] ?? 0}</div>
              </div>
              <div className="rounded-md border p-4">
                <div className="text-xs text-muted-foreground">High Attrition Risk</div>
                <div className="text-2xl font-semibold">{data.attrition_distribution?.high_risk ?? 0}</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
