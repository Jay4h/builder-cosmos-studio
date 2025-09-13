import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type Role = "commander" | "hr" | "medical" | "training" | "admin";
export type Language = "en" | "hi";

// Simple permissions map for RBAC demo
const rolePermissions: Record<Role, string[]> = {
  commander: [
    "view:dashboard",
    "view:analytics",
    "view:readiness",
    "view:personnel",
    "view:training",
    "simulate:scenarios",
  ],
  hr: [
    "view:dashboard",
    "view:personnel",
    "edit:personnel",
    "view:training",
    "view:analytics",
  ],
  medical: ["view:dashboard", "view:medical", "edit:medical"],
  training: [
    "view:dashboard",
    "view:training",
    "edit:training",
    "view:analytics",
  ],
  admin: [
    "view:dashboard",
    "view:analytics",
    "view:readiness",
    "view:personnel",
    "edit:personnel",
    "view:training",
    "edit:training",
    "view:medical",
    "edit:medical",
    "manage:access",
  ],
};

// Minimal i18n dictionary for demo
const dict = {
  en: {
    appTitle: "IAF Human Management System",
    dashboard: "Dashboard",
    personnel: "Personnel",
    allocation: "Workforce Allocation",
    training: "Training",
    health: "Health & Readiness",
    analytics: "AI Insights",
    decisions: "Decision Support",
    security: "Security",
    role: "Role",
    language: "Language",
    kpiPersonnel: "Total Personnel",
    kpiReadiness: "Readiness",
    kpiAttrition: "Attrition Risk",
    kpiTraining: "Training Complete",
    search: "Search",
    actions: "Actions",
    view: "View",
    edit: "Edit",
    scenario: "Scenario",
  },
  hi: {
    appTitle: "आईएएफ मानव प्रबंधन प्रणाली",
    dashboard: "डैशबोर्ड",
    personnel: "कार्मिक",
    allocation: "कार्यबल आवंटन",
    training: "प्रशिक्षण",
    health: "स्वास्थ्य और तत्परता",
    analytics: "एआई इनसाइट्स",
    decisions: "निर्णय सहायता",
    security: "सुरक्षा",
    role: "भूमिका",
    language: "भाषा",
    kpiPersonnel: "कुल कार्मिक",
    kpiReadiness: "तत्परता",
    kpiAttrition: "त्याग जोखिम",
    kpiTraining: "प्रशिक्षण पूर्ण",
    search: "खोजें",
    actions: "क्रियाएँ",
    view: "देखें",
    edit: "संपादित करें",
    scenario: "परिदृश्य",
  },
};

type AuthContextValue = {
  role: Role;
  setRole: (r: Role) => void;
  language: Language;
  setLanguage: (l: Language) => void;
  hasPermission: (perm: string) => boolean;
  t: (key: keyof (typeof dict)["en"]) => string;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<Role>("admin");
  const [language, setLanguage] = useState<Language>("en");

  useEffect(() => {
    document.documentElement.lang = language === "hi" ? "hi" : "en";
  }, [language]);

  const value = useMemo<AuthContextValue>(() => {
    const hasPermission = (perm: string) =>
      rolePermissions[role]?.includes(perm) ?? false;
    const t = (key: keyof (typeof dict)["en"]) =>
      dict[language][key] ?? String(key);
    return { role, setRole, language, setLanguage, hasPermission, t };
  }, [role, language]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
