import { r as reactExports, T as jsxRuntimeExports } from "./worker-entry-BVX9H0rW.js";
import { u as useDashboard } from "./DashboardContext-BRbhAxF6.js";
import { P as PageWrap } from "./PageWrap-DXFKHTMI.js";
import { u as useQuery } from "./useQuery-IFRgIcvx.js";
import { h as apiRequest } from "./router-Rs1rRA5L.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
function useActivityLogs() {
  return useQuery({
    queryKey: ["activityLogs"],
    queryFn: async () => {
      const resp = await apiRequest("/gamification/activity");
      return resp;
    }
  });
}
function SettingsView() {
  const { user } = useDashboard();
  const [gpsHighAccuracy, setGpsHighAccuracy] = reactExports.useState(true);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(PageWrap, { title: "Settings", subtitle: "Account intelligence and control", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 gap-4 xl:grid-cols-1", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-3xl border border-border/60 bg-gradient-card p-5 shadow-elegant", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-16 w-16 items-center justify-center rounded-2xl border border-blue-300/30 bg-linear-to-br from-blue-500 via-indigo-500 to-cyan-500 text-2xl font-bold text-white shadow-lg shadow-blue-950/40", children: user.initials }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-semibold text-foreground", children: user.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: user.email })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(SettingsToggle, { label: "GPS High Accuracy", on: gpsHighAccuracy, onToggle: () => setGpsHighAccuracy(!gpsHighAccuracy), hint: "Precision mapping mode" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border/40 bg-surface/40 p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-foreground uppercase tracking-widest", children: "Recent Activity" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ActivityList, {})
      ] })
    ] })
  ] }) }) }) });
}
function SettingsToggle({
  label,
  on,
  hint,
  onToggle
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "button",
    {
      type: "button",
      onClick: onToggle,
      className: "flex w-full items-center justify-between rounded-lg border border-border/40 bg-surface/40 px-3 py-2 text-left transition hover:border-primary/40 hover:bg-surface/60",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-foreground", children: label }),
          hint && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground", children: hint })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `relative h-5 w-9 rounded-full ${on ? "bg-primary" : "bg-surface"} transition`, children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `absolute top-0.5 h-4 w-4 rounded-full bg-foreground transition ${on ? "left-4.5" : "left-0.5"}` }) })
      ]
    }
  );
}
function ActivityList() {
  const { data: logs = [], isLoading } = useActivityLogs();
  if (isLoading) return /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "..." });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 mt-3", children: [
    logs.map((log) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground flex justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: log.action }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: new Date(log.createdAt).toLocaleTimeString() })
    ] }, log.id)),
    logs.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground", children: "No recent activity." })
  ] });
}
const SplitComponent = SettingsView;
export {
  SplitComponent as component
};
