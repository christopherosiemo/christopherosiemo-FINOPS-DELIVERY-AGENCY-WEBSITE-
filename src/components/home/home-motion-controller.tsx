"use client";

import { useEffect } from "react";

const motionTargetSelector = [
  "[data-motion-reveal]",
  "[data-motion-sequence]",
  "[data-motion-verification]",
].join(",");

export function HomeMotionController() {
  useEffect(() => {
    const homepage = document.querySelector<HTMLElement>('main[data-homepage="true"]');

    if (!homepage) return;

    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const targets = Array.from(homepage.querySelectorAll<HTMLElement>(motionTargetSelector));
    let observer: IntersectionObserver | undefined;

    const markEntered = (target: HTMLElement) => {
      target.dataset.motionState = "entered";
      observer?.unobserve(target);

      if (targets.every((item) => item.dataset.motionState === "entered")) {
        observer?.disconnect();
        homepage.dataset.motionComplete = "true";
      }
    };

    const applyPreference = () => {
      observer?.disconnect();
      homepage.dataset.motionController = "active";

      if (motionPreference.matches) {
        delete homepage.dataset.motionReady;
        homepage.dataset.motionPreference = "reduced";
        targets.forEach(markEntered);
        return;
      }

      homepage.dataset.motionPreference = "standard";
      homepage.dataset.motionReady = "true";
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) markEntered(entry.target as HTMLElement);
          });
        },
        { rootMargin: "0px 0px -10% 0px", threshold: 0.18 },
      );

      const pendingTargets = targets.filter((target) => target.dataset.motionState !== "entered");

      if (pendingTargets.length === 0) {
        observer.disconnect();
      } else {
        pendingTargets.forEach((target) => observer?.observe(target));
      }
    };

    applyPreference();
    motionPreference.addEventListener("change", applyPreference);

    return () => {
      observer?.disconnect();
      motionPreference.removeEventListener("change", applyPreference);
    };
  }, []);

  return null;
}
