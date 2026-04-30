import { r as reactExports, T as jsxRuntimeExports } from "./worker-entry-BVX9H0rW.js";
import { u as useQuery } from "./useQuery-IFRgIcvx.js";
import { h as apiRequest } from "./router-Rs1rRA5L.js";
import { P as PageWrap } from "./PageWrap-DXFKHTMI.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
function useQuizzes() {
  return useQuery({
    queryKey: ["quizzes"],
    queryFn: async () => {
      return apiRequest("/quizzes");
    }
  });
}
function QuizView() {
  const { data: quizzes = [], isLoading } = useQuizzes();
  const [activeQuiz, setActiveQuiz] = reactExports.useState(null);
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-64 w-full items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(PageWrap, { title: "Photo Quiz", subtitle: "Identify locations", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 gap-4 md:grid-cols-2", children: [
    quizzes.map((q) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setActiveQuiz(q), className: "rounded-2xl border border-border/40 bg-gradient-card p-4 text-left hover:border-primary/50 transition-colors", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold text-foreground", children: q.question }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-2", children: [
        "Worth: ",
        q.points,
        " XP"
      ] })
    ] }, q.id)),
    quizzes.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm col-span-2", children: "No quizzes available at the moment." })
  ] }) });
}
const SplitComponent = QuizView;
export {
  SplitComponent as component
};
