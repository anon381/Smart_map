import {
  Outlet,
  Link,
  createRootRoute,
  HeadContent,
  Scripts,
  useRouterState,
} from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import * as React from "react";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">
          Page not found
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Lovable App" },
      { name: "description", content: "Lovable Generated Project" },
      { name: "author", content: "Lovable" },
      { property: "og:title", content: "Lovable App" },
      { property: "og:description", content: "Lovable Generated Project" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:site", content: "@Lovable" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const authRoutes = new Set(["/signin", "/signup"]);
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });
  const previousPathnameRef = React.useRef(pathname);
  const previousPathname = previousPathnameRef.current;

  React.useEffect(() => {
    previousPathnameRef.current = pathname;
  }, [pathname]);

  const isAuthRoute = authRoutes.has(pathname);
  const wasAuthRoute = authRoutes.has(previousPathname);
  const shouldFlip =
    isAuthRoute && wasAuthRoute && pathname !== previousPathname;
  const direction =
    previousPathname === "/signin" && pathname === "/signup"
      ? 1
      : previousPathname === "/signup" && pathname === "/signin"
        ? -1
        : 1;

  return (
    <div style={shouldFlip ? { perspective: "1400px" } : undefined}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={pathname}
          initial={
            shouldFlip
              ? { opacity: 0, rotateY: direction * 90, scale: 0.98 }
              : { opacity: 0, y: 12 }
          }
          animate={
            shouldFlip
              ? { opacity: 1, rotateY: 0, scale: 1 }
              : { opacity: 1, y: 0 }
          }
          exit={
            shouldFlip
              ? { opacity: 0, rotateY: direction * -90, scale: 0.98 }
              : { opacity: 0, y: -12 }
          }
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          style={{ transformStyle: "preserve-3d" }}
        >
          <Outlet />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
