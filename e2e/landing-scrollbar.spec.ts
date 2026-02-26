import { expect, test } from "@playwright/test";

type NestedScrollableNode = {
  tag: string;
  id: string | null;
  className: string;
  overflowY: string;
  scrollHeight: number;
  clientHeight: number;
};

test("landing keeps a single vertical scroller", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Ache brechós incríveis");

  const nestedVerticalScrollers = await page.evaluate(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>("body *"));

    const results: NestedScrollableNode[] = [];
    for (const element of elements) {
      const style = window.getComputedStyle(element);
      const hasVerticalScrollStyle = /(auto|scroll|overlay)/.test(style.overflowY);
      const overflowsVertically = element.scrollHeight > element.clientHeight + 1;

      if (!hasVerticalScrollStyle || !overflowsVertically) {
        continue;
      }

      results.push({
        tag: element.tagName.toLowerCase(),
        id: element.id || null,
        className: element.className,
        overflowY: style.overflowY,
        scrollHeight: element.scrollHeight,
        clientHeight: element.clientHeight
      });
    }

    return results;
  });

  expect(nestedVerticalScrollers).toEqual([]);
});
