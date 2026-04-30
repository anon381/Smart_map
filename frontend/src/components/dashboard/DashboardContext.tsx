import { createContext, useContext, useState, type ReactNode } from "react";

export type CategoryId =
  | "food"
  | "game"
  | "culture"
  | "transport"
  | "study"
  | "health"
  | "art"
  | "services"
  | "hidden";

export type ViewId =
  | "dashboard"
  | "map"
  | "missions"
  | "leaderboard"
  | "rewards"
  | "social"
  | "settings";

type User = {
  email: string;
  name: string;
  initials: string;
  rank: "Bronze" | "Silver" | "Gold" | "Diamond";
  level: number;
  xp: number;
  xpNext: number;
  coins: number;
  points: number;
  streak: number;
  trustScore: number;
  totalMissions: number;
  city: string;
};

type Ctx = {
  activeCategory: CategoryId | null;
  openCategory: (c: CategoryId) => void;
  user: User;
};

const DashboardCtx = createContext<Ctx | null>(null);

import { useQuery } from "@tanstack/react-query";
import { authApi } from "@/lib/api";

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [activeCategory, setActiveCategory] = useState<CategoryId | null>(null);

  const { data: userData, isLoading } = useQuery({
    queryKey: ["me"],
    queryFn: () => authApi.getMe(),
    retry: false,
  });

  const openCategory = (c: CategoryId) => {
    setActiveCategory(c);
  };

  const user: User = {
    email: userData?.email || "loading@example.com",
    name: userData?.name || "Loading...",
    initials: userData?.name?.split(" ").map((n: string) => n[0]).join("") || "??",
    rank: "Gold", // These could also be fetched from backend if available
    level: userData?.level || 1,
    xp: userData?.xp || 0,
    xpNext: 1000,
    coins: userData?.coins || 0,
    points: userData?.points || 0,
    streak: userData?.streakCount || 0,
    trustScore: userData?.reputationScore || 0,
    totalMissions: 0,
    city: userData?.city || "Unknown",
  };

  return (
    <DashboardCtx.Provider value={{ activeCategory, openCategory, user }}>
      {children}
    </DashboardCtx.Provider>
  );
}

export function useDashboard() {
  const ctx = useContext(DashboardCtx);
  if (!ctx) throw new Error("useDashboard must be used inside DashboardProvider");
  return ctx;
}