import type { Page } from "@playwright/test";

const motionTargetSelector = "[data-motion-reveal], [data-motion-sequence], [data-motion-verification]";

export async function settleHomepageMotion(page: Page) {
  await page.waitForFunction(() => {
    const homepage = document.querySelector<HTMLElement>('main[data-homepage="true"]');
    return homepage?.dataset.motionController === "active";
  });

  await page.locator('main[data-homepage="true"]').evaluate((homepage, selector) => {
    homepage.querySelectorAll<HTMLElement>(selector).forEach((target) => {
      target.dataset.motionState = "entered";
    });
    homepage.dataset.motionComplete = "true";
  }, motionTargetSelector);

  await page.addStyleTag({
    content: `${motionTargetSelector} { animation: none !important; transition: none !important; }`,
  });
}
