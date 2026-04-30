import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useAds } from "@/hooks/useAds";
import { adsApi } from "@/lib/api";

export function AdBanner({ placement = "dashboard" }: { placement?: string }) {
  const { data: ads, isLoading, isError } = useAds(placement);
  const sentImpression = useRef(false);
  const ad = ads?.[0];

  useEffect(() => {
    if (ad && !sentImpression.current) {
      adsApi.trackImpression(ad.id).catch(() => {
        // Ignore tracking failures
      });
      sentImpression.current = true;
    }
  }, [ad]);

  if (!ad || isLoading || isError) {
    return null;
  }

  return (
    <section className="rounded-2xl border border-border/60 bg-gradient-card p-4 shadow-elegant">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
        {ad.imageUrl ? (
          <div className="h-36 w-full overflow-hidden rounded-2xl border border-border/40 bg-black/20 lg:h-28 lg:w-1/3">
            <img
              src={ad.imageUrl}
              alt={ad.title}
              className="h-full w-full object-cover"
            />
          </div>
        ) : null}

        <div className="flex-1">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground">Sponsored</p>
              <h3 className="mt-2 text-xl font-semibold text-foreground">{ad.title}</h3>
            </div>
            <p className="text-xs text-muted-foreground">Priority {ad.priority}</p>
          </div>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            {ad.description || "Recommended content for your city and mission progress."}
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <Button
              asChild
              variant="outlineGlow"
              size="sm"
            >
              <a
                href={ad.targetUrl}
                target="_blank"
                rel="noreferrer"
                onClick={() => {
                  adsApi.trackClick(ad.id).catch(() => undefined);
                }}
              >
                Learn more
              </a>
            </Button>
            <span className="text-xs text-muted-foreground">Placement: {ad.placement}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
