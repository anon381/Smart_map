import { T as jsxRuntimeExports, r as reactExports } from "./worker-entry-BVX9H0rW.js";
import { g as gsapWithCSS } from "./index-BnXv4-dU.js";
import { u as useDashboard } from "./DashboardContext-BRbhAxF6.js";
import { u as useQuery } from "./useQuery-IFRgIcvx.js";
import { h as apiRequest } from "./router-Rs1rRA5L.js";
import { P as PageWrap } from "./PageWrap-DXFKHTMI.js";
import { C as Crown, M as Medal } from "./medal-DClzhJjr.js";
import { T as Trophy } from "./trophy-zFu9ruhx.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
function useLeaderboard() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["leaderboard"],
    queryFn: () => apiRequest("/leaderboard/")
  });
  return {
    leaderboard: data || [],
    isLoading,
    error,
    refresh: refetch
  };
}
function useReveal(selector = "[data-reveal]") {
  const root = reactExports.useRef(null);
  reactExports.useEffect(() => {
    if (!root.current) return;
    const ctx = gsapWithCSS.context(() => {
      gsapWithCSS.from(selector, {
        y: 24,
        opacity: 0,
        duration: 0.55,
        ease: "power3.out",
        stagger: 0.06
      });
    }, root);
    return () => ctx.revert();
  }, [selector]);
  return root;
}
function Leaderboard() {
  const { user } = useDashboard();
  const { leaderboard, isLoading } = useLeaderboard();
  const root = useReveal();
  const top = leaderboard.slice(0, 3);
  const list = leaderboard.slice(3);
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-64 w-full items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref: root, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(PageWrap, { title: "Leaderboard", subtitle: "Climb the ranks across your city", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-reveal": true, className: "mb-5 flex flex-wrap items-center justify-between gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2", children: ["Global", "Regional", "Friends"].map((t, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          className: `rounded-full px-4 py-1.5 text-xs transition-all ${i === 1 ? "bg-gradient-primary text-primary-foreground shadow-glow" : "border border-border/60 text-muted-foreground hover:text-foreground"}`,
          children: t
        },
        t
      )) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
        "Season ends in ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary-glow", children: "12d 4h" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { "data-reveal": true, className: "mb-6 grid grid-cols-3 gap-3", children: top.map((p) => {
      const Icon = p.rank === 1 ? Crown : p.rank === 2 ? Trophy : Medal;
      const order = p.rank === 1 ? "order-2 -mt-3" : p.rank === 2 ? "order-1" : "order-3";
      const tone = p.rank === 1 ? "border-primary/60 shadow-glow bg-gradient-to-b from-primary/20 to-transparent" : "border-border/60";
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: `${order} rounded-2xl border ${tone} bg-gradient-card p-4 text-center transition-all hover:-translate-y-1`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "mx-auto h-7 w-7 text-primary-glow" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm font-semibold text-foreground", children: p.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-amber-300", children: p.badge }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-2 text-xs text-muted-foreground", children: [
              p.points.toLocaleString(),
              " XP"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 grid grid-cols-2 gap-1 text-[10px] text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                p.missions,
                " 📜"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-orange-300", children: [
                "🔥 ",
                p.streak
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-2 text-[10px] font-mono text-primary-glow", children: [
              "#",
              p.rank
            ] })
          ]
        },
        p.rank
      );
    }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-reveal": true, className: "overflow-hidden rounded-2xl border border-border/60 bg-gradient-card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-12 border-b border-border/40 bg-surface/40 px-5 py-2 text-[10px] uppercase tracking-widest text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "col-span-1", children: "Rank" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "col-span-5", children: "Explorer" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "col-span-2 text-right", children: "Missions" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "col-span-2 text-right", children: "Streak" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "col-span-2 text-right", children: "XP" })
      ] }),
      list.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(LeaderboardRow, { ...p }, p.rank)),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-t border-primary/40 bg-primary/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        LeaderboardRow,
        {
          rank: 47,
          name: `${user.name} (you)`,
          points: user.points,
          missions: user.totalMissions,
          streak: user.streak,
          highlight: true
        }
      ) })
    ] })
  ] }) });
}
function LeaderboardRow({
  rank,
  name,
  points,
  missions,
  streak,
  highlight
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: `grid grid-cols-12 items-center px-5 py-3 text-sm transition-colors ${highlight ? "text-foreground" : "text-muted-foreground hover:bg-surface/40"}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "col-span-1 font-mono", children: [
          "#",
          rank
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "col-span-5 truncate", children: name }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "col-span-2 text-right text-xs", children: missions }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "col-span-2 text-right text-xs text-orange-300", children: [
          "🔥 ",
          streak
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `col-span-2 text-right ${highlight ? "text-primary-glow" : ""}`, children: points.toLocaleString() })
      ]
    }
  );
}
const SplitComponent = Leaderboard;
export {
  SplitComponent as component
};
