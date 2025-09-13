export type DashboardOverview = {
  timestamp: string;
  overview: {
    total_personnel: number;
    active_personnel: number;
    deployed_personnel: number;
    high_risk_personnel: number;
    training_in_progress: number;
    system_health: string;
  };
  metrics?: { average_performance?: number; average_attrition_risk?: number };
  demographics?: { age_distribution?: Record<string, number> };
  risk_alerts?: Array<any>;
};

const BASE = "/api/backend"; // proxied by our server to BACKEND_BASE_URL

async function http<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "content-type": "application/json" },
    ...init,
  });
  if (!res.ok) throw new Error(`API ${res.status}`);
  return res.json();
}

export const api = {
  getOverview: () => http<DashboardOverview>("/api/dashboard/overview"),
  getAnalytics: () => http<any>("/api/dashboard/analytics"),
  getDecisionDashboard: () => http<any>("/api/decision-support/dashboard"),
};
