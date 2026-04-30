import { r as reactExports, T as jsxRuntimeExports } from "./worker-entry-BVX9H0rW.js";
import { u as useQuery } from "./useQuery-IFRgIcvx.js";
import { u as useNavigate, l as useQueryClient, h as apiRequest } from "./router-Rs1rRA5L.js";
const DashboardCtx = reactExports.createContext(null);
function DashboardProvider({ children }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeCategory, setActiveCategory] = reactExports.useState(null);
  const { data, isLoading, error } = useQuery({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token");
      return apiRequest("/dashboard/me");
    },
    retry: false,
    staleTime: 1e3 * 60 * 5
    // 5 minutes
  });
  const logout = () => {
    localStorage.removeItem("token");
    queryClient.clear();
    navigate({ to: "/signin" });
  };
  const openCategory = (c) => {
    setActiveCategory(c);
  };
  if (error) {
    logout();
    return null;
  }
  if (isLoading || !data) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-screen w-full items-center justify-center bg-black", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent shadow-glow" }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    DashboardCtx.Provider,
    {
      value: {
        activeCategory,
        openCategory,
        user: {
          ...data.user,
          initials: data.user.initials || data.user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2),
          rank: data.user.rank || (data.user.points > 1e3 ? "Gold" : "Bronze")
        },
        recentActivity: data.recentActivity || [],
        isLoading,
        logout
      },
      children
    }
  );
}
function useDashboard() {
  const ctx = reactExports.useContext(DashboardCtx);
  if (!ctx) throw new Error("useDashboard must be used inside DashboardProvider");
  return ctx;
}
export {
  DashboardProvider as D,
  useDashboard as u
};
