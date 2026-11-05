import { test, expect } from "@playwright/test";

for (const width of [1440, 390]) {
  test(`project and hosted-event paths work at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: width === 390 ? 844 : 1000 });
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto("/");
    await expect(page.locator("#projects")).toHaveCount(0);
    await expect(page.locator("#hosted-events")).toHaveCount(0);
    await page.evaluate(() =>
      scrollTo(0, document.documentElement.scrollHeight),
    );
    const choices = page.getByRole("navigation", {
      name: "Choose a portfolio chapter",
    });
    await choices.scrollIntoViewIfNeeded();
    await page.evaluate(() => document.fonts.ready);
    await choices.screenshot({
      path: `test-results/chapter-paths-${width}.png`,
    });
    await choices.getByRole("link", { name: /Projects/ }).click();
    await expect(page.locator("#projects-heading")).toBeInViewport();
    await expect(page.locator("#projects-heading")).toBeFocused();
    await expect(page.locator("#hosted-events")).toHaveCount(0);
    const tabs = page
      .getByRole("tablist", { name: "Choose a project" })
      .getByRole("tab");
    await expect(tabs).toHaveCount(4);
    for (let index = 0; index < 4; index++) {
      const tab = tabs.nth(index);
      await tab.click();
      await expect(tab).toHaveAttribute("aria-selected", "true");
      const panel = page.getByRole("tabpanel");
      const summary = panel.locator("summary");
      await summary.focus();
      await summary.press("Enter");
      await expect(panel.locator("details")).toHaveAttribute("open", "");
      await expect(
        panel.getByRole("heading", { name: "My part" }),
      ).toBeVisible();
      await expect(
        panel.getByRole("link", { name: /on GitHub/ }),
      ).toHaveAttribute("href", /^https:\/\/github.com\/amritkang165\//);
      const image = panel.locator(".workspace-screenshot img");
      await expect
        .poll(() => image.evaluate((el) => el.complete && el.naturalWidth > 0))
        .toBe(true);
      await summary.press("Enter");
    }
    await tabs.first().click();
    await page
      .locator("#projects")
      .screenshot({ path: `test-results/projects-${width}.png` });
    await choices.getByRole("link", { name: /Events I hosted/ }).click();
    await expect(page.locator("#events-heading")).toBeInViewport();
    await expect(page.locator("#projects")).toHaveCount(0);
    await expect(
      page.getByText("Main organizer · Bengaluru", { exact: true }),
    ).toBeVisible();
    await expect(
      page.getByText("EVENT LEAD · IGNITE ROOM", { exact: true }),
    ).toBeVisible();
    await expect(page.locator(".event-photo")).toHaveCount(6);
    for (const image of await page.locator(".event-photo img").all()) {
      await image.scrollIntoViewIfNeeded();
      await expect
        .poll(() => image.evaluate((el) => el.complete && el.naturalWidth > 0))
        .toBe(true);
    }
    await page
      .locator(".sunbeam-story")
      .screenshot({ path: `test-results/sunbeam-${width}.png` });
    await page
      .locator(".tinyfish-story")
      .screenshot({ path: `test-results/tinyfish-${width}.png` });
    await page.locator(".sunbeam-moment").evaluate((el) => {
      scrollTo(
        0,
        scrollY +
          el.getBoundingClientRect().top +
          el.offsetHeight -
          el.querySelector(".moment-stage").offsetHeight,
      );
    });
    await expect(page.locator(".moment-after")).not.toHaveAttribute("inert");
    const firstPhoto = page.getByRole("button", {
      name: "Enlarge photo: Sunbeam · Bengaluru, Scaler",
      exact: true,
    });
    await firstPhoto.click();
    const gallery = page.getByRole("dialog", { name: "Event photo gallery" });
    await expect(gallery).toBeVisible();
    await expect(
      gallery.getByRole("button", { name: "Close photo gallery" }),
    ).toBeFocused();
    await expect(page.locator("body")).toHaveCSS("overflow", "hidden");
    await page.keyboard.press("ArrowLeft");
    await expect(gallery.locator(".gallery-image")).toHaveAttribute(
      "src",
      /tinyfish-amrit/,
    );
    await gallery.getByRole("button", { name: "Next photo" }).click();
    await expect(gallery.locator(".gallery-image")).toHaveAttribute(
      "src",
      /sunbeam-community/,
    );
    await page.keyboard.press("ArrowRight");
    await expect(gallery.locator(".gallery-image")).toHaveAttribute(
      "src",
      /sunbeam-amrit/,
    );
    await gallery.screenshot({
      path: `test-results/event-gallery-${width}.png`,
    });
    await page.keyboard.press("Escape");
    await expect(gallery).not.toBeVisible();
    await expect(firstPhoto).toBeFocused();
    await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
    const lastPhoto = page.getByRole("button", {
      name: "Enlarge photo: TinyFish · Event Lead, Ignite Room",
      exact: true,
    });
    await lastPhoto.click();
    await gallery.getByRole("button", { name: "Close photo gallery" }).click();
    await expect(lastPhoto).toBeFocused();
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBe(width);
    expect(errors).toEqual([]);
  });
}

test("small phone keeps the hosted stories and photo controls accessible with reduced motion", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 568 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/#hosted-events");
  await expect(page.locator("#events-heading")).toBeInViewport();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(
    320,
  );
  await page
    .getByRole("button", {
      name: "Enlarge photo: TinyFish · Quad AI, Bengaluru",
      exact: true,
    })
    .click();
  await expect(
    page.getByRole("button", { name: "Next photo" }),
  ).toBeInViewport();
  await expect(
    page.getByRole("button", { name: "Close photo gallery" }),
  ).toBeInViewport();
  await page.keyboard.press("Escape");
  await page.getByRole("link", { name: "back to the two paths" }).click();
  await expect(page.locator("#hosted-events")).toHaveCount(0);
  await expect(page.locator("#projects")).toHaveCount(0);
  await expect(
    page.getByRole("navigation", { name: "Choose a portfolio chapter" }),
  ).toBeInViewport();
});

test("roads support returning, direct links, and browser Back and Forward", async ({
  page,
}) => {
  await page.goto("/#projects");
  await expect(page.locator("#projects-heading")).toBeInViewport();
  await expect(page.locator("#hosted-events")).toHaveCount(0);
  await page.getByRole("link", { name: "choose another road" }).click();
  await expect(page.locator("#projects")).toHaveCount(0);
  await expect(page.locator("#choices-heading")).toBeFocused();
  await page.getByRole("link", { name: /Events I hosted/ }).click();
  await expect(page.locator("#events-heading")).toBeFocused();
  await page.goBack();
  await expect(page.locator("#hosted-events")).toHaveCount(0);
  await expect(page.locator("#choices-heading")).toBeInViewport();
  await page.goBack();
  await expect(page.locator("#projects-heading")).toBeInViewport();
  await page.goForward();
  await expect(page.locator("#projects")).toHaveCount(0);
  await page.goForward();
  await expect(page.locator("#events-heading")).toBeInViewport();
  await page.reload();
  await expect(page.locator("#events-heading")).toBeInViewport();
  await expect(page.locator("#projects")).toHaveCount(0);
});
