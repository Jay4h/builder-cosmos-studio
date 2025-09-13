import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useAuth } from "@/context/AuthContext";
import { Activity, Users, TrendingDown, GraduationCap, Info } from "lucide-react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RTooltip,
  LineChart,
  Line,
} from "recharts";

const rankData = [
  { name: "Officers", value: 1200 },
  { name: "Airmen", value: 5400 },
  { name: "Technicians", value: 2100 },
  { name: "Support", value: 1500 },
];
const COLORS = ["#2b6cb0", "#3b82f6", "#7c3aed", "#16a34a"];

const readinessData = [
  { unit: "Alpha", readiness: 86 },
  { unit: "Bravo", readiness: 74 },
  { unit: "Charlie", readiness: 91 },
  { unit: "Delta", readiness: 68 },
];

const attritionTrend = Array.from({ length: 12 }, (_, i) => ({ month: i + 1, risk: 6 + Math.sin(i / 2) * 2 }));

function Heatmap() {
  const skills = ["Avionics", "Navigation", "Logistics", "Medical", "Cyber", "Flight Ops"];
  const units = ["A", "B", "C", "D", "E", "F"];
  return (
    <div className="grid grid-cols-7 gap-2">
      <div />
      {units.map((u) => (
        <div key={u} className="text-center text-xs text-muted-foreground">{u}</div>
      ))}
      {skills.map((s, row) => (
        <div key={s} className="contents">
          <div className="text-xs text-muted-foreground">{s}</div>
          {units.map((_, col) => {
            const v = Math.abs(Math.sin(row * 2 + col)) * 100;
            const color = `hsl(210 80% ${90 - v / 2}% / 1)`;
            return <div key={`${s}-${col}`} className="h-6 rounded" style={{ backgroundColor: color }} />;
          })}
        </div>
      ))}
    </div>
  );
}

export default function Dashboard() {
  const { hasPermission, t, role } = useAuth();
  const [tick, setTick] = useState(0);
  const [shock, setShock] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick((x) => x + 1), 4000);
    return () => clearInterval(id);
  }, []);

  const totals = useMemo(() => {
    const basePersonnel = 10200;
    const baseReadiness = 82;
    const baseAttrition = 7.2;
    const baseTraining = 76;
    const wave = Math.sin(tick / 2);
    return {
      personnel: basePersonnel + Math.round(wave * 20),
      readiness: Math.max(0, Math.min(100, baseReadiness - shock * 0.6 + wave * 2)),
      attrition: Math.max(0, baseAttrition + shock * 0.3 + (Math.cos(tick / 2) * 0.8)),
      training: Math.max(0, Math.min(100, baseTraining - shock * 0.4 + wave * 1.5)),
    };
  }, [tick, shock]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="text-base font-medium flex items-center gap-2"><Users className="h-4 w-4 text-primary" /> {t("kpiPersonnel")}</CardTitle>
            <Badge variant="secondary">Live</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{totals.personnel.toLocaleString()}</div>
            <p className="mt-1 text-sm text-muted-foreground">Distribution by rank</p>
            <div className="h-28">
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={rankData} dataKey="value" nameKey="name" innerRadius={30} outerRadius={45}>
                    {rankData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="text-base font-medium flex items-center gap-2"><Activity className="h-4 w-4 text-primary" /> {t("kpiReadiness")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <div className="text-3xl font-semibold">{totals.readiness.toFixed(0)}%</div>
              <Badge variant="outline">Unit</Badge>
            </div>
            <Progress value={totals.readiness} className="mt-2" />
            <div className="h-28 mt-2">
              <ResponsiveContainer>
                <BarChart data={readinessData}>
                  <XAxis dataKey="unit" hide />
                  <YAxis hide domain={[0, 100]} />
                  <RTooltip cursor={{ fill: "hsl(var(--muted))" }} />
                  <Bar dataKey="readiness" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="text-base font-medium flex items-center gap-2"><TrendingDown className="h-4 w-4 text-primary" /> {t("kpiAttrition")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{totals.attrition.toFixed(1)}%</div>
            <p className="mt-1 text-sm text-muted-foreground">12-month trend</p>
            <div className="h-28">
              <ResponsiveContainer>
                <LineChart data={attritionTrend}>
                  <XAxis dataKey="month" hide />
                  <YAxis hide domain={[0, 12]} />
                  <RTooltip cursor={{ stroke: "hsl(var(--muted))" }} />
                  <Line type="monotone" dataKey="risk" stroke="hsl(var(--accent))" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="text-base font-medium flex items-center gap-2"><GraduationCap className="h-4 w-4 text-primary" /> {t("kpiTraining")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{totals.training.toFixed(0)}%</div>
            <p className="mt-1 text-sm text-muted-foreground">Avg. program completion</p>
            <Progress value={totals.training} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="font-display text-xl">Skill gaps heatmap</CardTitle>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>Higher intensity indicates shortage.</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardHeader>
          <CardContent>
            <Heatmap />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="font-display text-xl">{t("scenario")}: What-if simulator</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <label className="text-sm text-muted-foreground">Attrition shock (%)</label>
            <input
              aria-label="Attrition shock"
              type="range"
              min={0}
              max={20}
              value={shock}
              onChange={(e) => setShock(parseInt(e.target.value))}
              className="w-full accent-[hsl(var(--accent))]"
            />
            <div className="text-sm text-muted-foreground">Impact on readiness: {Math.round(-shock * 0.6)}%</div>
            {hasPermission("simulate:scenarios") || role === "admin" ? (
              <Button className="w-full">Run Simulation</Button>
            ) : (
              <Button className="w-full" disabled>
                Restricted
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="font-display text-xl">Alerts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start justify-between rounded-md border p-3">
              <div>
                <div className="text-sm font-medium">Medical clearance lapse</div>
                <div className="text-xs text-muted-foreground">3 personnel require immediate attention.</div>
              </div>
              <Badge variant="destructive">High</Badge>
            </div>
            <div className="flex items-start justify-between rounded-md border p-3">
              <div>
                <div className="text-sm font-medium">Training backlog</div>
                <div className="text-xs text-muted-foreground">12 pending evaluations.</div>
              </div>
              <Badge>Medium</Badge>
            </div>
            <div className="flex items-start justify-between rounded-md border p-3">
              <div>
                <div className="text-sm font-medium">Upcoming mission readiness check</div>
                <div className="text-xs text-muted-foreground">Unit Charlie in 5 days.</div>
              </div>
              <Badge variant="outline">Info</Badge>
            </div>
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="font-display text-xl">AI Insights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>
              Predicted skill shortage in Cyber for Units B and D within next quarter. Recommend reskilling 12 personnel
              and prioritizing training module CYB-201.
            </p>
            <p>
              Attrition risk elevated for support staff due to relocation cycles. Consider targeted retention bonuses and
              flexible postings.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
