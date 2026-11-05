import { test, expect } from "@playwright/test";

for (const width of [1440, 390]) {
  test(`all five project previews open and gallery focus returns at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: width === 390 ? 844 : 1000 });
    await page.goto("/#projects");
    await expect(page.getByRole("tab")).toHaveCount(5);
    await expect(page.getByRole("tab", { name: /Scheduler/ })).toHaveCount(0);
    for (const name of [
      "MERAWARD",
      "Pocki",
      "ReGit",
      "Khata Ledger",
      "Clippit",
    ]) {
      await page.getByRole("tab", { name, exact: true }).click();
      await expect
        .poll(() =>
          page
            .locator(".workspace-screenshot img")
            .evaluate((img) => img.complete && img.naturalWidth > 0),
        )
        .toBe(true);
      const open = page.getByRole("button", {
        name: `Enlarge ${name} screenshot`,
      });
      await open.click();
      const gallery = page.getByRole("dialog", {
        name: "Project screenshot gallery",
      });
      await expect(gallery).toBeVisible();
      await expect(
        gallery.getByRole("button", { name: "Close project screenshot" }),
      ).toBeFocused();
      await expect(page.locator("body")).toHaveCSS("overflow", "hidden");
      await page.keyboard.press("Escape");
      await expect(gallery).not.toBeVisible();
      await expect(open).toBeFocused();
    }
    await page
      .getByRole("button", { name: "Enlarge Clippit screenshot" })
      .click();
    await page.keyboard.press("ArrowRight");
    await expect(page.locator(".project-full-image")).toHaveAttribute(
      "src",
      /meraward.png/,
    );
    await page.keyboard.press("ArrowLeft");
    await expect(page.locator(".project-full-image")).toHaveAttribute(
      "src",
      /clippit.png/,
    );
    await page.keyboard.press("ArrowLeft");
    await expect(page.locator(".project-full-image")).toHaveAttribute(
      "src",
      /khata-ledger.png/,
    );
    await page
      .getByRole("button", { name: "Previous project screenshot" })
      .click();
    await expect(page.locator(".project-full-image")).toHaveAttribute(
      "src",
      /regit.png/,
    );
    await page
      .getByRole("button", { name: "Close project screenshot" })
      .click();
    await expect(
      page.getByRole("button", { name: "Enlarge ReGit screenshot" }),
    ).toBeFocused();
    await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
    await expect(
      page.getByRole("link", { name: /ReGit on GitHub/ }),
    ).toHaveAttribute("href", "https://github.com/amritkang165/ReGit");
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBe(width);
    await page
      .locator(".project-workspace")
      .screenshot({ path: `test-results/project-fan-${width}.png` });
  });
}

test("reduced motion keeps screenshot controls and disables the traveling bow", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/#projects");
  await expect(page.locator(".road-traveler")).toHaveCSS("display", "none");
  await page.getByRole("tab", { name: "Khata Ledger", exact: true }).click();
  await page
    .getByRole("button", { name: "Enlarge Khata Ledger screenshot" })
    .click();
  await expect(
    page.getByRole("dialog", { name: "Project screenshot gallery" }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(
    page.getByRole("button", { name: "Enlarge Khata Ledger screenshot" }),
  ).toBeFocused();
});
