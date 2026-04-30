import { T as jsxRuntimeExports, r as reactExports } from "./worker-entry-BVX9H0rW.js";
import { u as useQuery } from "./useQuery-IFRgIcvx.js";
import { c as createLucideIcon, h as apiRequest } from "./router-Rs1rRA5L.js";
import { P as PageWrap } from "./PageWrap-DXFKHTMI.js";
import { T as Target, F as Flame } from "./target-ChMmWkKN.js";
import { C as Coffee, G as Gem } from "./gem-D7BnQZRj.js";
import { B as Bus, C as Church, W as Wrench, P as Palette, H as HeartPulse } from "./wrench-BO99wvHv.js";
import { C as CircleCheck } from "./circle-check-CSl792q1.js";
import { S as ShieldCheck } from "./shield-check-Djcyo47P.js";
import { T as Trophy } from "./trophy-zFu9ruhx.js";
import { S as Sparkles } from "./sparkles-Bxjlj9qG.js";
import { M as MapPin } from "./map-pin-BUU7vxjx.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
const __iconNode$3 = [
  ["path", { d: "M7 7h10v10", key: "1tivn9" }],
  ["path", { d: "M7 17 17 7", key: "1vkiza" }]
];
const ArrowUpRight = createLucideIcon("arrow-up-right", __iconNode$3);
const __iconNode$2 = [
  [
    "path",
    {
      d: "M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z",
      key: "3c2336"
    }
  ],
  ["path", { d: "m15 9-6 6", key: "1uzhvr" }],
  ["path", { d: "M9 9h.01", key: "1q5me6" }],
  ["path", { d: "M15 15h.01", key: "lqbp3k" }]
];
const BadgePercent = createLucideIcon("badge-percent", __iconNode$2);
const __iconNode$1 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "M12 6v6l4 2", key: "mmk7yg" }]
];
const Clock = createLucideIcon("clock", __iconNode$1);
const __iconNode = [
  [
    "path",
    {
      d: "M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z",
      key: "r04s7s"
    }
  ]
];
const Star = createLucideIcon("star", __iconNode);
function useMissions() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["missions"],
    queryFn: () => apiRequest("/missions/log")
  });
  return {
    missions: data || [],
    isLoading,
    error,
    refresh: refetch
  };
}
function MiniStat({
  icon: Icon,
  label,
  value,
  tint
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border/60 bg-gradient-card p-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] uppercase tracking-widest text-muted-foreground", children: label }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: `h-4 w-4 ${tint}` })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-xl font-bold text-foreground", children: value })
  ] });
}
const CategoryIcons = {
  food: Coffee,
  game: Sparkles,
  culture: Church,
  transport: Bus,
  study: Gem,
  health: HeartPulse,
  art: Palette,
  services: Wrench,
  hidden: Sparkles,
  "Food & Drinks": Coffee,
  "Transport": Bus,
  "Culture & Faith": Church,
  "Art & Creativity": Sparkles,
  "Study & Education": Gem,
  "Hidden Gems": Sparkles,
  "High-Value": Trophy
};
function MissionLog() {
  const { missions, isLoading } = useMissions();
  const [activeFilter, setActiveFilter] = reactExports.useState("all");
  const missionFilters = reactExports.useMemo(() => [
    {
      id: "all",
      label: "All",
      icon: Target,
      description: "Every verified mission",
      accent: "text-primary-glow",
      count: missions.length
    },
    {
      id: "food",
      label: "Food",
      icon: Coffee,
      description: "Food & Drinks missions",
      accent: "text-orange-300",
      count: missions.filter((m) => m.cat === "food" || m.cat === "Food & Drinks").length
    },
    {
      id: "transport",
      label: "Transport",
      icon: Bus,
      description: "Transit and mobility spots",
      accent: "text-sky-300",
      count: missions.filter((m) => m.cat === "transport" || m.cat === "Transport").length
    },
    {
      id: "culture",
      label: "Culture",
      icon: Church,
      description: "Heritage and faith locations",
      accent: "text-amber-200",
      count: missions.filter((m) => m.cat === "culture" || m.cat === "Culture & Faith").length
    }
  ], [missions]);
  const filteredMissions = reactExports.useMemo(() => {
    if (activeFilter === "all") return missions;
    return missions.filter((m) => {
      const cat = m.cat.toLowerCase();
      if (activeFilter === "food") return cat.includes("food");
      if (activeFilter === "transport") return cat.includes("transport");
      if (activeFilter === "culture") return cat.includes("culture");
      return true;
    });
  }, [activeFilter, missions]);
  const stats = reactExports.useMemo(() => {
    const visible = filteredMissions.length;
    const xp = filteredMissions.reduce((sum, mission) => sum + mission.xp, 0);
    const coins = filteredMissions.reduce((sum, mission) => sum + mission.coins, 0);
    const avgAi = visible === 0 ? 0 : filteredMissions.reduce((sum, mission) => sum + mission.ai, 0) / visible;
    return { visible, xp, coins, avgAi };
  }, [filteredMissions]);
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-64 w-full items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(PageWrap, { title: "Mission Log", subtitle: "Verified captures · AI confidence visible", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4 xl:grid-cols-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(MiniStat, { icon: CircleCheck, label: "Verified", value: "142", tint: "text-success" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(MiniStat, { icon: Flame, label: "This Week", value: "9", tint: "text-orange-300" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(MiniStat, { icon: Star, label: "High-Value", value: "27", tint: "text-amber-300" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(MiniStat, { icon: ShieldCheck, label: "Avg AI Trust", value: "98.4%", tint: "text-primary-glow" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(MiniStat, { icon: Target, label: "Visible Cards", value: String(stats.visible), tint: "text-sky-300" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(MiniStat, { icon: BadgePercent, label: "Mission XP", value: stats.xp.toLocaleString(), tint: "text-emerald-300" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mb-6 rounded-2xl border border-border/60 bg-gradient-card p-4 shadow-elegant", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4 flex items-center justify-between gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-widest text-muted-foreground", children: "Mission Categories" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mt-1 text-lg font-semibold text-foreground", children: "Tap a card to filter the log" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
          stats.visible,
          " missions · ",
          stats.coins.toLocaleString(),
          " coins · ",
          stats.avgAi.toFixed(1),
          "% AI trust"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3", children: missionFilters.map((filter) => {
        const Icon = filter.icon;
        const active = activeFilter === filter.id;
        return /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => setActiveFilter(filter.id),
            className: `group rounded-2xl border p-4 text-left transition-all ${active ? "border-primary/60 bg-primary/15 shadow-glow" : "border-border/60 bg-surface/40 hover:-translate-y-0.5 hover:border-primary/40 hover:bg-surface/60"}`,
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: `h-4 w-4 ${active ? "text-primary-glow" : filter.accent}` }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold text-foreground", children: filter.label })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs text-muted-foreground", children: filter.description })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `rounded-full px-2 py-1 text-[10px] font-semibold ${active ? "bg-primary text-primary-foreground" : "bg-black/40 text-muted-foreground"}`, children: String(filter.count).padStart(2, "0") })
            ] })
          },
          filter.id
        );
      }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3", children: filteredMissions.map((m) => {
      const Icon = CategoryIcons[m.cat] || Target;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "article",
        {
          className: "group overflow-hidden rounded-2xl border border-border/60 bg-gradient-card shadow-elegant transition-all hover:-translate-y-1 hover:border-primary/50 hover:shadow-glow",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `relative aspect-video bg-linear-to-br ${m.photo}`, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-black/60 px-2.5 py-1 text-[10px] uppercase tracking-widest text-foreground backdrop-blur", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-3 w-3 text-primary-glow" }),
                " ",
                m.cat
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute right-3 top-3 rounded-full bg-success/20 px-2 py-1 text-[10px] font-mono text-success backdrop-blur", children: [
                "AI ",
                m.ai,
                "%"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute bottom-3 left-3 right-3 flex items-end justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-base font-bold text-foreground drop-shadow", children: [
                  "#",
                  m.id
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-full bg-black/60 px-2 py-1 text-[10px] text-muted-foreground backdrop-blur", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "mr-1 inline h-2.5 w-2.5" }),
                  m.when
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold text-foreground", children: m.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 line-clamp-2 text-xs text-muted-foreground", children: m.tip }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 flex flex-wrap gap-1", children: m.tags.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "rounded-md border border-border/60 bg-surface/40 px-1.5 py-0.5 text-[10px] text-muted-foreground",
                  children: t
                },
                t
              )) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex items-center gap-1.5 text-[10px] font-mono text-muted-foreground", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-3 w-3 text-primary-glow" }),
                " ",
                m.gps
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex items-center justify-between border-t border-border/40 pt-3 text-xs", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-primary-glow", children: [
                  "+",
                  m.xp,
                  " XP"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-amber-300", children: [
                  "+",
                  m.coins,
                  " 🪙"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "text-muted-foreground hover:text-primary-glow", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUpRight, { className: "h-4 w-4" }) })
              ] })
            ] })
          ]
        },
        m.id
      );
    }) }),
    filteredMissions.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-2xl border border-border/60 bg-surface/40 p-6 text-center text-sm text-muted-foreground", children: "No missions match this category yet." })
  ] });
}
const SplitComponent = MissionLog;
export {
  SplitComponent as component
};
