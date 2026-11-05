import { test, expect } from "@playwright/test";

for (const width of [1440, 390]) {
  test(`chosen roads stay attached and retain the pink palette at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: width === 390 ? 844 : 1000 });
    await page.goto("/#chapters");
    await expect(page.locator(".personal-drawer")).toHaveCount(0);
    const nav = page.getByRole("navigation", {
      name: "Choose a portfolio chapter",
    });
    const measureConnection = () =>
      page
        .locator(".journey-continuation .connection-selected")
        .evaluate((path) => {
          const root = document
            .querySelector(".journal-chapters")
            .getBoundingClientRect();
          const sign = document
            .querySelector(".chapter-choice[aria-current]")
            .getBoundingClientRect();
          const marker = document
            .querySelector(".road-arrival i")
            .getBoundingClientRect();
          const first = path.getPointAtLength(0);
          const last = path.getPointAtLength(path.getTotalLength());
          return Math.max(
            Math.abs(first.x - (sign.left + sign.width / 2 - root.left)),
            Math.abs(first.y - (sign.bottom - root.top)),
            Math.abs(last.x - (marker.left + marker.width / 2 - root.left)),
            Math.abs(last.y - (marker.top + marker.height / 2 - root.top)),
          );
        });
    for (const name of [/Projects/, /Events I hosted/]) {
      await nav.getByRole("link", { name }).click();
      await expect(page.locator(".journey-continuation")).toHaveCount(1);
      await expect.poll(measureConnection).toBeLessThan(1);
      await expect(page.locator(".project-world, .event-world")).toHaveCSS(
        "background-color",
        "rgb(245, 218, 227)",
      );
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
      ).toBe(width);
    }
    await page.setViewportSize({
      width: width === 390 ? 320 : 1100,
      height: 800,
    });
    await expect.poll(measureConnection).toBeLessThan(1);
    await page.getByRole("link", { name: "choose another road" }).click();
    await expect(page.locator(".journey-continuation")).toHaveCount(0);
    await expect(page.locator("#choices-heading")).toBeFocused();
  });
}

test("workspace tabs support arrow keys and display the matching real project", async ({
  page,
}) => {
  await page.goto("/#projects");
  const tabs = page.getByRole("tab");
  await tabs.first().focus();
  await page.keyboard.press("ArrowRight");
  await expect(tabs.nth(1)).toBeFocused();
  await expect(page.getByRole("tabpanel")).toHaveAccessibleName(/Pocki/);
  await expect(page.locator(".workspace-screenshot img")).toHaveAttribute(
    "src",
    /pocki.png/,
  );
  await page.keyboard.press("End");
  await expect(tabs.last()).toBeFocused();
  await expect(page.getByRole("tabpanel")).toHaveAccessibleName(/Khata Ledger/);
  await expect(
    page.getByRole("link", { name: /Khata Ledger on GitHub/ }),
  ).toHaveAttribute("href", /khata-ledger$/);
  await expect(
    page.getByRole("link", { name: /Khata Ledger on GitHub/ }),
  ).toContainText("View repository");
  await page.keyboard.press("ArrowRight");
  await expect(tabs.first()).toBeFocused();
  await expect(page.locator(".workspace-screenshot img")).toHaveAttribute(
    "src",
    /meraward.png/,
  );
  await page.keyboard.press("ArrowLeft");
  await expect(tabs.last()).toBeFocused();
  await page.keyboard.press("Home");
  await expect(tabs.first()).toBeFocused();
});

test("Sunbeam scroll reveals the room, reverses, and can be skipped with a keyboard", async ({
  page,
}) => {
  await page.goto("/#hosted-events");
  const scene = page.locator(".sunbeam-moment");
  const position = await scene.evaluate((el) => ({
    top: scrollY + el.getBoundingClientRect().top,
    distance: el.offsetHeight - el.querySelector(".moment-stage").offsetHeight,
  }));
  await page.evaluate((top) => scrollTo(0, top), position.top);
  await expect(page.locator(".moment-before")).not.toHaveAttribute("inert");
  await expect(page.locator(".moment-after")).toHaveAttribute("inert", "");
  await page.screenshot({ path: "test-results/sunbeam-story-before.png" });
  await page.evaluate(
    (end) => scrollTo(0, end),
    position.top + position.distance,
  );
  await expect(page.locator(".moment-after")).not.toHaveAttribute("inert");
  await expect(page.locator(".moment-before")).toHaveAttribute("inert", "");
  await expect(page.locator(".moment-resolution")).toHaveCSS("opacity", "1");
  await page.screenshot({ path: "test-results/sunbeam-story-after.png" });
  await page.getByRole("button", { name: "Replay the moment" }).click();
  await expect(page.locator(".moment-before")).not.toHaveAttribute("inert");
  const reveal = page.getByRole("button", { name: "Reveal the room" });
  await reveal.focus();
  await reveal.press("Enter");
  await expect(page.locator(".moment-after")).not.toHaveAttribute("inert");
  await page.getByRole("button", { name: "Skip to the team" }).click();
  await expect(page.locator("#sunbeam-after-moment")).toBeFocused();
  await expect(page.locator("#sunbeam-after-moment")).toBeInViewport();
});

test("small screen, reduced motion, and unavailable fonts retain both stories and all projects", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 568 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.route("**/fonts.googleapis.com/**", (route) => route.abort());
  await page.goto("/#hosted-events");
  await expect(page.locator(".sunbeam-moment")).toHaveClass(/moment-static/);
  await expect(page.locator(".moment-before")).not.toHaveAttribute("inert");
  await expect(page.locator(".moment-after")).not.toHaveAttribute("inert");
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(
    320,
  );
  await page.getByRole("link", { name: "choose another road" }).click();
  await page
    .getByRole("navigation", { name: "Choose a portfolio chapter" })
    .getByRole("link", { name: /Projects/ })
    .click();
  for (const tab of await page.getByRole("tab").all()) {
    await tab.click();
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBe(320);
  }
});
