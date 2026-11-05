import { test, expect } from "@playwright/test";

for (const width of [1440, 390]) {
  test(
    "editorial journal and direct contact work at " + width + "px",
    async ({ page }) => {
      await page.setViewportSize({ width, height: width === 390 ? 844 : 1000 });
      await page.addInitScript(() =>
        Object.defineProperty(navigator, "clipboard", {
          value: {
            writeText: async (text) => {
              window.testCopiedEmail = text;
            },
          },
        }),
      );
      await page.goto("/#hosted-events");
      await expect(page.locator(".sunbeam-memory")).toContainText(
        /A month and a half\s*of hard work/,
      );
      await expect(page.locator(".tinyfish-memory")).toContainText(
        "Resolving people’s doubts",
      );
      await expect(
        page.locator(".envelope-scene, .ribbon-connector, .demo-panel"),
      ).toHaveCount(0);
      const contact = page.locator("#contact");
      await expect(
        contact.getByRole("link", { name: "amritkang2805@icloud.com" }),
      ).toHaveAttribute("href", "mailto:amritkang2805@icloud.com");
      await contact.getByRole("button", { name: "Copy email address" }).click();
      await expect(contact.getByRole("status")).toHaveText("Email copied.");
      expect(await page.evaluate(() => window.testCopiedEmail)).toBe(
        "amritkang2805@icloud.com",
      );
      await expect(
        contact.getByRole("link", { name: /GitHub/ }),
      ).toHaveAttribute("href", "https://github.com/amritkang165");
      await contact.screenshot({
        path: "test-results/editorial-contact-" + width + ".png",
      });
      await page
        .getByRole("navigation", { name: "Choose a portfolio chapter" })
        .getByRole("link", { name: /Projects/ })
        .click();
      await expect(
        page.locator(".demo-trigger, .research-art, .schedule-art"),
      ).toHaveCount(0);
      await expect(page.getByRole("tab")).toHaveCount(5);
      await expect(page.locator(".workspace-screenshot img")).toHaveCount(1);
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
      ).toBe(width);
    },
  );
}

test("contact remains usable when clipboard access is unavailable", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.addInitScript(() =>
    Object.defineProperty(navigator, "clipboard", {
      value: {
        writeText: async () => {
          throw new Error("denied");
        },
      },
    }),
  );
  await page.goto("/");
  await page.getByRole("button", { name: "Copy email address" }).click();
  await expect(page.locator("#contact [role=status]")).toContainText(
    "select the email",
  );
  await expect(page.locator("#contact a").first()).toHaveAttribute(
    "href",
    /^mailto:/,
  );
});
