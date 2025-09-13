import { NavLink, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/context/AuthContext";
import { Menu, Shield, Bell, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Layout() {
  const { role, setRole, language, setLanguage, t } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) setSidebarOpen(true);
    };
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const navItems = [
    { to: "/", label: t("dashboard") },
    { to: "/personnel", label: t("personnel") },
    { to: "/allocation", label: t("allocation") },
    { to: "/training", label: t("training") },
    { to: "/health", label: t("health") },
    { to: "/analytics", label: t("analytics") },
    { to: "/decisions", label: t("decisions") },
    { to: "/security", label: t("security") },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/40 text-foreground">
      <header className="sticky top-0 z-30 border-b bg-card/80 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex h-16 items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <button
                aria-label="Toggle menu"
                className="lg:hidden"
                onClick={() => setSidebarOpen((s) => !s)}
              >
                <Menu className="h-6 w-6" />
              </button>
              <div className="flex items-center gap-2">
                <Shield className="h-6 w-6 text-primary" />
                <span className="font-display text-lg font-semibold tracking-wide">
                  {t("appTitle")}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Select value={role} onValueChange={(v) => setRole(v as any)}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder={t("role")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="commander">Commander</SelectItem>
                  <SelectItem value="hr">HR Manager</SelectItem>
                  <SelectItem value="medical">Medical Officer</SelectItem>
                  <SelectItem value="training">Training Dept</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={language}
                onValueChange={(v) => setLanguage(v as any)}
              >
                <SelectTrigger className="w-[110px]">
                  <SelectValue placeholder={t("language")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="hi">हिन्दी</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="ghost" size="icon" aria-label="Notifications">
                <Bell className="h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="hidden sm:inline-flex"
              >
                <LogOut className="h-4 w-4" />
                <span className="ml-1">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-6 py-6">
          <aside
            className={cn(
              "rounded-lg border bg-card p-3",
              !sidebarOpen && "hidden lg:block",
            )}
          >
            <nav className="flex flex-col gap-1">
              {navItems.map((n) => (
                <NavLink
                  key={n.to}
                  to={n.to}
                  className={({ isActive }) =>
                    cn(
                      "rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-foreground/80",
                    )
                  }
                  onClick={() => setSidebarOpen(false)}
                >
                  {n.label}
                </NavLink>
              ))}
            </nav>
          </aside>
          <main className="min-w-0">
            <Outlet />
          </main>
        </div>
      </div>
      <footer className="border-t py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Indian Air Force • Human Management System
      </footer>
    </div>
  );
}
