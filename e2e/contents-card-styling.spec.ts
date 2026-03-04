import { expect, test } from "@playwright/test";

test("content list cards keep visual styling and excerpt clamp", async ({ page }) => {
  await page.goto("/contents");
  const { cardStyles, excerptStyles } = await page.evaluate(() => {
    const card = document.createElement("article");
    card.className = "surface-card content-card";

    const excerpt = document.createElement("p");
    excerpt.className = "content-card-excerpt";
    excerpt.textContent = "Lorem ipsum dolor sit amet, consectetur adipiscing elit.";
    card.appendChild(excerpt);
    document.body.appendChild(card);

    const cardStyle = window.getComputedStyle(card);
    const excerptStyle = window.getComputedStyle(excerpt);

    const result = {
      cardStyles: {
        borderTopWidth: cardStyle.borderTopWidth,
        borderTopStyle: cardStyle.borderTopStyle,
        borderRadius: cardStyle.borderRadius,
        backgroundColor: cardStyle.backgroundColor
      },
      excerptStyles: {
        display: excerptStyle.display,
        overflow: excerptStyle.overflow,
        webkitLineClamp: excerptStyle.getPropertyValue("-webkit-line-clamp").trim()
      }
    };

    card.remove();
    return result;
  });

  expect(cardStyles.borderTopWidth).not.toBe("0px");
  expect(cardStyles.borderTopStyle).not.toBe("none");
  expect(cardStyles.borderRadius).not.toBe("0px");
  expect(cardStyles.backgroundColor).not.toBe("rgba(0, 0, 0, 0)");

  expect(excerptStyles.display).not.toBe("inline");
  expect(excerptStyles.overflow).toBe("hidden");
  expect(excerptStyles.webkitLineClamp).toBe("3");
});
