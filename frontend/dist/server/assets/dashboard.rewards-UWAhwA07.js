import { T as jsxRuntimeExports } from "./worker-entry-BVX9H0rW.js";
import { u as useDashboard } from "./DashboardContext-BRbhAxF6.js";
import { u as useQuery } from "./useQuery-IFRgIcvx.js";
import { c as createLucideIcon, h as apiRequest } from "./router-Rs1rRA5L.js";
import { P as PageWrap } from "./PageWrap-DXFKHTMI.js";
import { Z as Zap } from "./zap-BWFVR-9-.js";
import { S as Sparkles } from "./sparkles-Bxjlj9qG.js";
import { W as Wrench, P as Palette, H as HeartPulse, B as Bus, C as Church } from "./wrench-BO99wvHv.js";
import { G as Gem, C as Coffee } from "./gem-D7BnQZRj.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
const __iconNode$1 = [
  ["path", { d: "M19.07 4.93A10 10 0 0 0 6.99 3.34", key: "z3du51" }],
  ["path", { d: "M4 6h.01", key: "oypzma" }],
  ["path", { d: "M2.29 9.62A10 10 0 1 0 21.31 8.35", key: "qzzz0" }],
  ["path", { d: "M16.24 7.76A6 6 0 1 0 8.23 16.67", key: "1yjesh" }],
  ["path", { d: "M12 18h.01", key: "mhygvu" }],
  ["path", { d: "M17.99 11.66A6 6 0 0 1 15.77 16.67", key: "1u2y91" }],
  ["circle", { cx: "12", cy: "12", r: "2", key: "1c9p78" }],
  ["path", { d: "m13.41 10.59 5.66-5.66", key: "mhq4k0" }]
];
const Radar = createLucideIcon("radar", __iconNode$1);
const __iconNode = [
  [
    "path",
    {
      d: "M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z",
      key: "qn84l0"
    }
  ],
  ["path", { d: "M13 5v2", key: "dyzc3o" }],
  ["path", { d: "M13 17v2", key: "1ont0d" }],
  ["path", { d: "M13 11v2", key: "1wjjxi" }]
];
const Ticket = createLucideIcon("ticket", __iconNode);
function useShop() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["shop"],
    queryFn: () => apiRequest("/shop/items")
  });
  return {
    shopItems: data || [],
    isLoading,
    error,
    refresh: refetch
  };
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
  hidden: Sparkles
};
function RewardsShop() {
  const { user } = useDashboard();
  const { shopItems, isLoading } = useShop();
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-64 w-full items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(PageWrap, { title: "Rewards Shop", subtitle: "Spend coins on perks and partner deals", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6 grid grid-cols-1 gap-4 lg:grid-cols-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-primary/40 bg-gradient-card p-5 shadow-glow lg:col-span-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Wallet Balance" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1 text-4xl font-bold text-foreground", children: [
              "🪙 ",
              user.coins.toLocaleString()
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-xs text-muted-foreground", children: "Earn more by completing high-value missions and daily streaks." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "rounded-full bg-gradient-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-glow", children: "+ Top Up" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 grid grid-cols-3 gap-2 text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-border/60 bg-surface/40 p-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] uppercase text-muted-foreground", children: "Earned 7d" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold text-success", children: "+820" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-border/60 bg-surface/40 p-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] uppercase text-muted-foreground", children: "Spent 7d" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold text-destructive", children: "-450" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-border/60 bg-surface/40 p-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] uppercase text-muted-foreground", children: "Active Boosters" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold text-primary-glow", children: "2" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border/60 bg-gradient-card p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Active Inventory" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "mt-3 space-y-2 text-xs", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center justify-between rounded-lg border border-border/40 bg-surface/40 p-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2 text-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "h-3.5 w-3.5 text-amber-300" }),
              " 2x XP"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "18h left" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center justify-between rounded-lg border border-border/40 bg-surface/40 p-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2 text-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Radar, { className: "h-3.5 w-3.5 text-primary-glow" }),
              " Radar"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "3 uses" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center justify-between rounded-lg border border-border/40 bg-surface/40 p-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2 text-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Ticket, { className: "h-3.5 w-3.5 text-rose-300" }),
              " Cafe coupon"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "12d" })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4", children: shopItems.map((it) => {
      const Icon = CategoryIcons[it.type] || Zap;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "article",
        {
          className: "flex flex-col rounded-2xl border border-border/60 bg-gradient-card p-4 transition-all hover:-translate-y-1 hover:border-primary/50 hover:shadow-glow",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `flex h-24 items-center justify-center rounded-xl bg-linear-to-br ${it.tint || "from-surface/60 to-surface/30"} text-foreground`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-9 w-9 text-primary-glow drop-shadow" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex items-start justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground", children: it.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded-md border border-border/60 bg-surface/40 px-1.5 py-0.5 text-[10px] text-muted-foreground", children: it.type })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs text-muted-foreground", children: it.description }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-[10px] text-primary-glow", children: it.detail }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "mt-3 w-full rounded-full bg-gradient-primary px-3 py-2 text-xs font-semibold text-primary-foreground shadow-glow", children: [
              "Buy · 🪙 ",
              it.price
            ] })
          ]
        },
        it.id
      );
    }) })
  ] }) });
}
const SplitComponent = RewardsShop;
export {
  SplitComponent as component
};
