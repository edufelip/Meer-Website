import { expect, test } from "@playwright/test";

const viewports = [
  { width: 320, height: 900 },
  { width: 768, height: 1024 },
  { width: 1024, height: 900 },
  { width: 1440, height: 1000 }
];

for (const viewport of viewports) {
  test(`contents hero stays centered and overlay matches card (${viewport.width}x${viewport.height})`, async ({
    page
  }) => {
    await page.setViewportSize(viewport);
    await page.goto("/contents");

    const heroCard = page.locator("header a.group.block").first();
    const overlay = heroCard.locator("div.absolute.inset-0").first();

    await expect(heroCard).toBeVisible();
    await expect(overlay).toBeVisible();

    const cardBox = await heroCard.boundingBox();
    const overlayBox = await overlay.boundingBox();

    expect(cardBox).not.toBeNull();
    expect(overlayBox).not.toBeNull();

    if (!cardBox || !overlayBox) {
      return;
    }

    const viewportCenterX = viewport.width / 2;
    const cardCenterX = cardBox.x + cardBox.width / 2;
    const centerDelta = Math.abs(cardCenterX - viewportCenterX);

    expect(centerDelta).toBeLessThanOrEqual(1.5);
    expect(Math.abs(cardBox.x - overlayBox.x)).toBeLessThanOrEqual(1);
    expect(Math.abs(cardBox.y - overlayBox.y)).toBeLessThanOrEqual(1);
    expect(Math.abs(cardBox.width - overlayBox.width)).toBeLessThanOrEqual(1);
    expect(Math.abs(cardBox.height - overlayBox.height)).toBeLessThanOrEqual(1);
  });
}
