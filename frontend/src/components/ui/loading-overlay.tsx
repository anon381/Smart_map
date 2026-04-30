"use client";

import * as React from "react";

type Props = {
  onFinish?: () => void;
  demoDuration?: number;
  showImmediately?: boolean;
};

export default function LoadingOverlay({
  onFinish,
  demoDuration = 2200,
  showImmediately = false,
}: Props) {
  const [visible, setVisible] = React.useState(showImmediately);
  const [paused, setPaused] = React.useState(false);
  const timerRef = React.useRef<number | null>(null);

  // add 2 seconds to existing demo duration
  const effectiveDuration = (demoDuration ?? 2200) + 2000;

  React.useEffect(() => {
    // Only show overlay on homepage
    if (!showImmediately) return;

    setVisible(true);

    return () => {
    };
  }, [showImmediately]);

  React.useEffect(() => {
    if (!visible) return;

    // lock scroll: capture current scroll and fix body position
    const scrollY = window.scrollY || window.pageYOffset || 0;
    const prevOverflow = document.body.style.overflow;
    const prevPosition = document.body.style.position;
    const prevTop = document.body.style.top;
    const prevLeft = document.body.style.left;
    const prevWidth = document.body.style.width;

    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = "0";
    document.body.style.width = "100%";

    // prevent touch scroll on mobile
    const touchHandler = (e: TouchEvent) => {
      e.preventDefault();
    };
    document.addEventListener("touchmove", touchHandler, { passive: false });

    timerRef.current = window.setTimeout(() => {
      document.removeEventListener("touchmove", touchHandler);
      document.body.style.overflow = prevOverflow;
      document.body.style.position = prevPosition;
      document.body.style.top = prevTop;
      document.body.style.left = prevLeft;
      document.body.style.width = prevWidth;
      window.scrollTo(0, scrollY);

      setVisible(false);
      onFinish?.();
    }, effectiveDuration);

    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      document.removeEventListener("touchmove", touchHandler);
      document.body.style.overflow = prevOverflow;
      document.body.style.position = prevPosition;
      document.body.style.top = prevTop;
      document.body.style.left = prevLeft;
      document.body.style.width = prevWidth;
      window.scrollTo(0, scrollY);
    };
  }, [visible, effectiveDuration, onFinish]);

  if (!visible) return null;

  return (
    <div
      aria-hidden="false"
      role="status"
      className="fixed inset-0 z-9999 flex items-center justify-center bg-background/90 backdrop-blur-md"
    >
      <div className="max-w-xl mx-auto px-4 sm:px-6 text-center">
        <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold mb-6 text-white tracking-tight">
          Smart Map
        </h1>

        <div className="flex flex-col items-center justify-center gap-6 mx-auto">
          <style>{`
            @keyframes pulseRing { 0% { transform: scale(.92); opacity: .18 } 45% { opacity: .52 } 100% { transform: scale(1.22); opacity: 0 } }
            @keyframes radarSweep { from { transform: translate(-50%, -50%) rotate(0deg); } to { transform: translate(-50%, -50%) rotate(360deg); } }
            @keyframes radarPing { 0% { transform: scale(.35); opacity: .0 } 20% { opacity: .8 } 100% { transform: scale(1.15); opacity: 0 } }
            @keyframes progress { from { width: 0%; } to { width: 100%; } }
            .orbit-path {
              transform-box: fill-box;
              transform-origin: center;
            }
          `}</style>

          {/* Decorative pulsing backdrop */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="relative">
              <span className="absolute inset-0 rounded-full bg-linear-to-r from-emerald-400/20 via-primary/12 to-transparent blur-3xl opacity-60" />
              <span className="absolute inset-0 rounded-full border border-emerald-300/10 animate-[pulseRing_2200ms_ease-out_infinite]" />
            </div>
          </div>

          <button
            onClick={() => {
              if (timerRef.current) {
                window.clearTimeout(timerRef.current);
                timerRef.current = null;
              }
              setVisible(false);
              document.body.style.overflow = "";
              onFinish?.();
            }}
            aria-label="Dismiss loading"
            className="relative z-30 flex items-center justify-center rounded-full p-2 focus:outline-none"
          >
            <div
              className="relative flex items-center justify-center w-32 h-32 sm:w-40 sm:h-40 md:w-52 md:h-52"
              onClick={(e) => {
                e.stopPropagation();
                setPaused((current) => !current);
              }}
            >
              <div className="absolute inset-0 rounded-full border border-emerald-300/8 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.12)_0%,rgba(16,185,129,0.06)_18%,rgba(255,255,255,0.03)_42%,transparent_72%)] shadow-[0_0_48px_rgba(16,185,129,0.14)]" />
              <div className="absolute inset-[14%] rounded-full border border-emerald-300/12" />
              <div className="absolute inset-[28%] rounded-full border border-emerald-300/12" />
              <div className="absolute inset-[42%] rounded-full border border-emerald-300/12" />

              <div
                className="orbit-path absolute left-1/2 top-1/2 h-[1px] w-[74%]"
                style={{ animation: paused ? "none" : "radarSweep 2.6s linear infinite" }}
              >
                <span className="absolute inset-y-0 right-0 w-1/2 bg-linear-to-r from-transparent via-emerald-300/75 to-transparent shadow-[0_0_22px_rgba(110,231,183,0.75)]" />
              </div>

              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background:
                    "radial-gradient(circle at center, transparent 0 55%, rgba(16,185,129,0.18) 55.5%, transparent 56.5%)",
                  animation: paused ? "none" : "radarPing 2.6s ease-out infinite",
                }}
              />

              <div className="absolute inset-[34%] rounded-full bg-background/85 backdrop-blur-sm ring-1 ring-emerald-300/10 shadow-[inset_0_0_24px_rgba(16,185,129,0.10)]" />

              <span className="absolute top-[18%] left-1/2 -translate-x-1/2 text-[10px] font-semibold uppercase tracking-[0.32em] text-emerald-200/75">
                Scanning map
              </span>
            </div>
          </button>

          <div className="w-full max-w-sm px-4 sm:px-6">
            <div className="h-2 overflow-hidden rounded-full bg-white/10 shadow-[0_0_0_1px_rgba(255,255,255,0.05)]">
              <div
                className="h-full rounded-full bg-linear-to-r from-emerald-400 via-primary to-accent shadow-[0_0_20px_rgba(16,185,129,0.45)]"
                style={{
                  width: "0%",
                  animation: `progress ${effectiveDuration}ms linear forwards`,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
