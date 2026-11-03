import { test, expect } from "@playwright/test";

test("cover, map, all destinations, filters, and real assets work", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "hello, world." }),
  ).toBeVisible();
  await page.evaluate(() => document.fonts.ready);
  await expect(page.locator(".shader-reveal canvas")).toHaveCount(1);
  await page.waitForTimeout(2200);
  await page.screenshot({ path: "test-results/desktop-cover.png" });
  await page.getByRole("button", { name: "Pause animations" }).click();
  await expect(page.locator(".shader-reveal canvas")).toHaveCount(0);
  await page.getByRole("link", { name: "come, take the scenic route" }).click();
  await expect(
    page.getByRole("heading", { name: "A curious mind. A soft little heart." }),
  ).toBeVisible();
  await page.screenshot({ path: "test-results/desktop-profile.png" });
  await page.locator("#crossroads").scrollIntoViewIfNeeded();
  await page.screenshot({ path: "test-results/desktop-map.png" });
  await page
    .getByRole("button", { name: "Explore Projects", exact: true })
    .click();
  await expect(page.locator(".project-card")).toHaveCount(4);
  await page.getByRole("button", { name: "iOS", exact: true }).click();
  await expect(page.locator(".project-card")).toHaveCount(1);
  await expect(page.locator(".project-card")).toContainText("Pocki");
  await page.getByRole("button", { name: "Systems", exact: true }).click();
  await expect(page.locator(".project-card")).toHaveCount(2);
  await page
    .getByRole("button", { name: "All", exact: false })
    .filter({ hasText: "04" })
    .click();
  await page.screenshot({ path: "test-results/desktop-projects.png" });
  await page.getByRole("button", { name: "Events", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "HackClub · Sunbeam" }),
  ).toBeVisible();
  await expect(page.locator(".event-list a")).toHaveCount(5);
  await page.getByRole("button", { name: "Open source", exact: true }).click();
  await expect(page.locator(".contribution")).toHaveCount(4);
  await expect(page.locator(".contribution").first()).toHaveAttribute(
    "href",
    "https://github.com/flisk-sh/flisk/pull/416",
  );
  await page
    .getByRole("button", { name: "Little things", exact: true })
    .click();
  await expect(page.locator(".memory")).toHaveCount(3);
  await page.getByRole("button", { name: "Make a little magic" }).click();
  await expect(page.locator(".bubble")).toHaveCount(16);
  await page.screenshot({ path: "test-results/desktop-wishlist.png" });
  const broken = await page
    .locator("img")
    .evaluateAll((images) =>
      images
        .filter((img) => !img.complete || img.naturalWidth === 0)
        .map((img) => img.src),
    );
  expect(broken).toEqual([]);
  const resume = await page.request.get("/Amrit-Kang-Resume.pdf");
  expect(resume.status()).toBe(200);
  expect(resume.headers()["content-type"]).toContain("application/pdf");
  expect(errors).toEqual([]);
});

test("phone navigation, branch deep links, back history and reduced motion", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  await expect(page.locator(".shader-reveal canvas")).toHaveCount(0);
  await page.screenshot({ path: "test-results/mobile-cover.png" });
  await page.getByRole("button", { name: "Open navigation" }).click();
  await page.getByRole("link", { name: "the map", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Open navigation" }),
  ).toHaveAttribute("aria-expanded", "false");
  await page.locator("#crossroads").scrollIntoViewIfNeeded();
  await page.screenshot({ path: "test-results/mobile-map.png" });
  await page
    .getByRole("button", { name: "Explore Open source", exact: true })
    .click();
  await expect(page).toHaveURL(/#opensource$/);
  await expect(page.locator(".contribution")).toHaveCount(4);
  await page
    .getByRole("button", { name: "Little things", exact: true })
    .click();
  await page.goBack();
  await expect(page.locator(".contribution")).toHaveCount(4);
  await page.reload();
  await expect(page.locator(".contribution")).toHaveCount(4);
  await page.getByRole("button", { name: "Projects", exact: true }).click();
  await page.screenshot({ path: "test-results/mobile-projects.png" });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page
    .getByRole("button", { name: "Little things", exact: true })
    .click();
  await page
    .getByRole("heading", { name: "The dreams-still-pending shelf" })
    .scrollIntoViewIfNeeded();
  await page.screenshot({ path: "test-results/mobile-wishlist.png" });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});
