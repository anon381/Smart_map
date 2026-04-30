import { T as jsxRuntimeExports } from "./worker-entry-BVX9H0rW.js";
import { u as useQuery } from "./useQuery-IFRgIcvx.js";
import { c as createLucideIcon, h as apiRequest } from "./router-Rs1rRA5L.js";
import { P as PageWrap } from "./PageWrap-DXFKHTMI.js";
import { A as AnimatePresence } from "./index-BAQPS4lQ.js";
import { t as motion } from "./proxy-Bi1nrx_f.js";
import { S as Share2 } from "./share-2-qOGOSp8E.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
const __iconNode = [
  ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", key: "1yyitq" }],
  ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }],
  ["line", { x1: "19", x2: "19", y1: "8", y2: "14", key: "1bvyxn" }],
  ["line", { x1: "22", x2: "16", y1: "11", y2: "11", key: "1shjgl" }]
];
const UserPlus = createLucideIcon("user-plus", __iconNode);
function useSocial() {
  const { data: friends = [], isLoading: friendsLoading, error: friendsError, refetch: refetchFriends } = useQuery({
    queryKey: ["friends"],
    queryFn: () => apiRequest("/social/friends")
  });
  const { data: teamQuests = [], isLoading: questsLoading, error: questsError, refetch: refetchQuests } = useQuery({
    queryKey: ["quests"],
    queryFn: () => apiRequest("/social/quests")
  });
  return {
    friends,
    teamQuests,
    isLoading: friendsLoading || questsLoading,
    error: friendsError || questsError,
    refresh: () => {
      refetchFriends();
      refetchQuests();
    }
  };
}
function SocialHub() {
  const { friends, isLoading } = useSocial();
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-64 w-full items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(PageWrap, { title: "Social Hub", subtitle: "Friends, teams, and referrals", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 gap-4 xl:grid-cols-[1.35fr_0.85fr]", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-3xl border border-border/60 bg-gradient-card p-5 shadow-elegant", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4 flex items-center justify-between gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground", children: "Active Friends" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Live status from your crew" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "flex items-center gap-1 rounded-full border border-border/60 px-3 py-1 text-xs text-muted-foreground hover:text-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(UserPlus, { className: "h-3 w-3" }),
          " Add"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 gap-3 md:grid-cols-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: friends.map((f, i) => {
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.li,
          {
            initial: { opacity: 0, x: -10 },
            animate: { opacity: 1, x: 0 },
            transition: { delay: i * 0.05 },
            className: "flex list-none flex-col gap-3 rounded-xl border border-border/40 bg-surface/40 p-4 transition-all hover:border-primary/40 hover:bg-surface/60",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-10 w-10 items-center justify-center rounded-full bg-surface text-sm font-bold text-foreground", children: f.name.slice(0, 1) }),
                    f.live && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-black bg-success shadow-glow-success animate-pulse" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground", children: f.name }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground uppercase", children: f.status })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "rounded-full bg-surface/60 p-1.5 text-muted-foreground hover:bg-primary/20 hover:text-primary-glow transition-colors", children: "👍" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "rounded-full bg-surface/60 p-1.5 text-muted-foreground hover:bg-primary/20 hover:text-primary-glow transition-colors", children: "🚀" })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between border-t border-border/40 pt-2 text-[10px]", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground text-xs", children: [
                  "Level ",
                  Math.floor(f.xp / 1e3) + 1
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-primary-glow text-xs", children: [
                  f.xp.toLocaleString(),
                  " XP"
                ] })
              ] })
            ]
          },
          f.userId
        );
      }) }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-3xl border border-primary/40 bg-gradient-card p-5 shadow-glow", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Share2, { className: "h-5 w-5 text-primary-glow" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-sm font-semibold text-foreground", children: "Your Referral Code" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 font-mono text-2xl tracking-widest text-primary-glow", children: "SMART-MAP-2026" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-3 text-xs text-muted-foreground", children: [
        "Earn ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary-glow", children: "+500 🪙" }),
        " when a friend completes their first mission."
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "mt-4 w-full rounded-full bg-gradient-primary px-4 py-2 text-sm font-semibold text-primary-foreground", children: "Share to Socials" })
    ] }) })
  ] }) }) });
}
const SplitComponent = SocialHub;
export {
  SplitComponent as component
};
