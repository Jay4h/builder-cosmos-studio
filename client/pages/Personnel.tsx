import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

const PEOPLE = [
  {
    id: "IAF001",
    name: "Arjun Singh",
    rank: "Officer",
    unit: "Alpha",
    skills: ["Flight Ops", "Leadership"],
  },
  {
    id: "IAF214",
    name: "Neha Verma",
    rank: "Technician",
    unit: "Bravo",
    skills: ["Avionics", "Navigation"],
  },
  {
    id: "IAF390",
    name: "Ravi Kumar",
    rank: "Airman",
    unit: "Charlie",
    skills: ["Logistics"],
  },
  {
    id: "IAF442",
    name: "Sanjana Rao",
    rank: "Medical",
    unit: "Delta",
    skills: ["Medical", "Fitness"],
  },
];

export default function PersonnelPage() {
  const { hasPermission, t } = useAuth();
  const [q, setQ] = useState("");

  const rows = useMemo(() => {
    const qi = q.toLowerCase();
    return PEOPLE.filter((p) =>
      [p.name, p.rank, p.unit, p.id, ...p.skills].some((v) =>
        v.toLowerCase().includes(qi),
      ),
    );
  }, [q]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-display text-xl">
            {t("personnel")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Input
              placeholder={`${t("search")}…`}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="max-w-md"
            />
            {hasPermission("edit:personnel") ? (
              <Button>Add Personnel</Button>
            ) : (
              <Button disabled title="Insufficient permissions">
                Add Personnel
              </Button>
            )}
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full divide-y">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    ID
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Name
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Rank
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Unit
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Skills
                  </th>
                  <th className="px-3 py-2 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    {t("actions")}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {rows.map((p) => (
                  <tr key={p.id} className="hover:bg-accent/50">
                    <td className="px-3 py-2 text-sm">{p.id}</td>
                    <td className="px-3 py-2 text-sm">{p.name}</td>
                    <td className="px-3 py-2 text-sm">{p.rank}</td>
                    <td className="px-3 py-2 text-sm">{p.unit}</td>
                    <td className="px-3 py-2 text-sm">
                      <div className="flex flex-wrap gap-1">
                        {p.skills.map((s) => (
                          <Badge key={s} variant="secondary">
                            {s}
                          </Badge>
                        ))}
                      </div>
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm">
                          {t("view")}
                        </Button>
                        {hasPermission("edit:personnel") ? (
                          <Button size="sm">{t("edit")}</Button>
                        ) : (
                          <Button size="sm" disabled>
                            {t("edit")}
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
