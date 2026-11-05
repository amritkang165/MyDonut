import { test, expect } from "@playwright/test";

// Compare rendered pixels, not merely component state, to verify the reveal.
async function difference(page, before, after) {
  return page.evaluate(
    async ([a, b]) => {
      const load = (src) =>
        new Promise((resolve) => {
          const img = new Image();
          img.onload = () => resolve(img);
          img.src = src;
        });
      const [aImg, bImg] = await Promise.all([load(a), load(b)]);
      const canvas = document.createElement("canvas");
      canvas.width = 180;
      canvas.height = 125;
      const context = canvas.getContext("2d");
      context.drawImage(aImg, 0, 0, 180, 125);
      const aPixels = context.getImageData(0, 0, 180, 125).data;
      context.drawImage(bImg, 0, 0, 180, 125);
      const bPixels = context.getImageData(0, 0, 180, 125).data;
      let changed = 0;
      for (let i = 0; i < aPixels.length; i += 4) {
        if (
          Math.abs(aPixels[i] - bPixels[i]) +
            Math.abs(aPixels[i + 1] - bPixels[i + 1]) +
            Math.abs(aPixels[i + 2] - bPixels[i + 2]) >
          60
        )
          changed++;
      }
      return changed / (180 * 125);
    },
    [
      "data:image/png;base64," + before.toString("base64"),
      "data:image/png;base64," + after.toString("base64"),
    ],
  );
}

test("full-screen cover reveals the real second image under a liquid cursor trail", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });
  await page.goto("/");
  await expect(page.locator(".image-reveal")).toHaveAttribute(
    "data-ready",
    "true",
  );
  await page.evaluate(() => document.fonts.ready);
  const bounds = await page.locator(".image-reveal").boundingBox();
  expect(bounds).toEqual({ x: 0, y: 0, width: 1440, height: 1000 });
  const before = await page.screenshot({
    path: "test-results/banner-before.png",
  });
  await page.waitForTimeout(1000);
  const idle = await page.screenshot();
  expect(await difference(page, before, idle)).toBeLessThan(0.005);
  await page.mouse.move(730, 370);
  for (const [x, y] of [
    [830, 330],
    [960, 380],
    [1030, 490],
    [920, 550],
    [790, 490],
    [870, 420],
  ]) {
    await page.mouse.move(x, y, { steps: 7 });
    await page.waitForTimeout(45);
  }
  const revealed = await page.screenshot({
    path: "test-results/banner-hover.png",
  });
  expect(await difference(page, before, revealed)).toBeGreaterThan(0.06);
  await page.mouse.move(-20, -20);
  await page.waitForTimeout(7000);
  const restored = await page.screenshot({
    path: "test-results/banner-restored.png",
  });
  expect(await difference(page, before, restored)).toBeLessThan(0.01);
  await page.getByRole("button", { name: "reveal my photo" }).click();
  await expect(
    page.getByRole("button", { name: "back to kitty" }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.mouse.move(-20, -20);
  await page.waitForTimeout(1000);
  const photo = await page.screenshot({
    path: "test-results/banner-photo.png",
  });
  // The edited portrait and Kitty deliberately share a pink background;
  // the subject must change substantially even when the backdrop stays similar.
  expect(await difference(page, before, photo)).toBeGreaterThan(0.3);
  await expect(page.locator(".reveal-back")).toHaveAttribute(
    "src",
    "/images/amrit-blush-banner.png",
  );
  await page.getByRole("button", { name: "back to kitty" }).click();
  await page.mouse.move(-20, -20);
  await page.waitForTimeout(1200);
  expect(await difference(page, before, await page.screenshot())).toBeLessThan(
    0.01,
  );
  expect(errors).toEqual([]);
});

test("phone cover supports tap reveal and native vertical swiping", async ({
  browser,
}) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    isMobile: true,
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:5173/");
  await expect(page.locator(".image-reveal")).toHaveAttribute(
    "data-ready",
    "true",
  );
  await page.screenshot({ path: "test-results/banner-mobile-before.png" });
  await page.touchscreen.tap(200, 380);
  await expect(
    page.getByRole("button", { name: "back to kitty" }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.waitForTimeout(1000);
  await page.screenshot({ path: "test-results/banner-mobile-photo.png" });
  await page.touchscreen.tap(200, 380);
  await expect(
    page.getByRole("button", { name: "reveal my photo" }),
  ).toHaveAttribute("aria-pressed", "false");
  expect(
    await page.evaluate(
      () =>
        document.documentElement.scrollWidth === innerWidth &&
        document.documentElement.scrollHeight > innerHeight * 2,
    ),
  ).toBe(true);
  const cdp = await context.newCDPSession(page);
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchStart",
    touchPoints: [{ x: 190, y: 650 }],
  });
  for (const y of [600, 540, 470, 400, 320, 240]) {
    await cdp.send("Input.dispatchTouchEvent", {
      type: "touchMove",
      touchPoints: [{ x: 190, y }],
    });
    await page.waitForTimeout(35);
  }
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchEnd",
    touchPoints: [],
  });
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(100);
  await page.screenshot({ path: "test-results/scroll-mobile-mid.png" });
  await page.locator("#meet-me").scrollIntoViewIfNeeded();
  await expect(
    page.getByRole("heading", { name: "A bit about me." }),
  ).toBeVisible();
  await expect
    .poll(() =>
      page
        .locator(".full-banner")
        .evaluate((el) =>
          Number(getComputedStyle(el).getPropertyValue("--portrait-blend")),
        ),
    )
    .toBe(1);
  await page.waitForTimeout(120);
  await page.screenshot({ path: "test-results/scroll-mobile-meet.png" });
  await context.close();
});

test("reduced motion and unavailable WebGL still allow keyboard image switching", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator("canvas")).toHaveCount(0);
  await page.keyboard.press("Tab");
  await page.keyboard.press("Enter");
  await expect(page.locator(".image-reveal")).toHaveClass(/show-photo/);
  await page.keyboard.press("Enter");
  await expect(page.locator(".image-reveal")).not.toHaveClass(/show-photo/);
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (type, ...args) {
      if (type.includes("webgl")) return null;
      return original.call(this, type, ...args);
    };
  });
  await page.reload();
  await expect(page.locator(".reveal-front")).toBeVisible();
  await page.getByRole("button", { name: "reveal my photo" }).click();
  await expect(page.locator(".image-reveal")).toHaveClass(/show-photo/);
  await expect(page.locator("canvas")).toHaveCount(0);
  await page.evaluate(() =>
    scrollTo({ top: innerHeight, behavior: "instant" }),
  );
  await expect(page.locator(".image-reveal")).toHaveClass(/is-scrolling/);
  await expect(page.locator(".reveal-back")).toHaveCSS("opacity", "1");
});

test("scroll progressively melts the cover, releases into pink, and reverses", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await expect(page.locator(".image-reveal")).toHaveAttribute(
    "data-ready",
    "true",
  );
  await page.mouse.move(-20, -20);
  const initial = await page.screenshot();
  const travel = await page
    .locator(".scroll-story")
    .evaluate(
      (el) => el.offsetHeight - el.querySelector(".full-banner").offsetHeight,
    );
  await page.evaluate(
    (y) => scrollTo({ top: y, behavior: "instant" }),
    travel * 0.12,
  );
  await page.waitForTimeout(180);
  expect((await page.locator(".full-banner").boundingBox()).y).toBe(0);
  const partial = await page.screenshot({
    path: "test-results/scroll-desktop-mid.png",
  });
  const partialChange = await difference(page, initial, partial);
  expect(partialChange).toBeGreaterThan(0.02);
  await page.evaluate(
    (y) => scrollTo({ top: y, behavior: "instant" }),
    travel * 0.48,
  );
  await page.waitForTimeout(180);
  const full = await page.screenshot({
    path: "test-results/scroll-desktop-portrait.png",
  });
  expect(await difference(page, initial, full)).toBeGreaterThan(
    partialChange + 0.05,
  );
  await page.evaluate(
    (y) => scrollTo({ top: y, behavior: "instant" }),
    travel + 350,
  );
  await page.waitForTimeout(180);
  expect((await page.locator(".full-banner").boundingBox()).y).toBeLessThan(0);
  await page.screenshot({ path: "test-results/scroll-desktop-handoff.png" });
  await page.locator("#meet-me").scrollIntoViewIfNeeded();
  await expect(
    page.getByRole("heading", { name: "A bit about me." }),
  ).toBeVisible();
  await page.screenshot({ path: "test-results/scroll-desktop-meet.png" });
  await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
  await page.waitForTimeout(180);
  expect(await difference(page, initial, await page.screenshot())).toBeLessThan(
    0.01,
  );
  expect(errors).toEqual([]);
});

for (const width of [1440, 390]) {
  test(`portrait settles into a readable scrapbook at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: width === 390 ? 844 : 1000 });
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    await page.getByRole("link", { name: "scroll to meet me" }).click();
    const more = page.getByRole("link", { name: "About me" });
    await expect(more).toBeInViewport();
    await expect
      .poll(() =>
        page
          .locator(".portrait-intro")
          .evaluate((el) => getComputedStyle(el).opacity),
      )
      .toBe("1");
    await expect(
      page.getByRole("heading", { name: "hi, I’m Amrit." }),
    ).toBeFocused();
    const card = await page.locator(".portrait-frame").boundingBox();
    const introduction = await page.locator(".portrait-intro").boundingBox();
    expect(card.width).toBeLessThan(width / 1.4);
    expect(card.x).toBeGreaterThan(0);
    expect(card.y).toBeGreaterThan(0);
    if (width === 390) {
      expect(card.y + card.height).toBeLessThan(introduction.y);
      expect(introduction.y + introduction.height).toBeLessThan(844);
    } else {
      expect(card.x + card.width).toBeLessThan(introduction.x);
    }
    await page.screenshot({
      path: `test-results/scrapbook-portrait-${width}.png`,
    });
    await more.click();
    await expect(
      page.getByRole("heading", { name: "BITS Pilani" }),
    ).toBeInViewport();
    await expect(page.getByText("9.27")).toBeVisible();
    const resume = page.getByRole("link", {
      name: /Read my résumé/,
    });
    const response = await page.request.get(await resume.getAttribute("href"));
    expect(response.ok()).toBe(true);
    expect(response.headers()["content-type"]).toContain("application/pdf");
    await page
      .locator("#meet-me")
      .screenshot({ path: `test-results/scrapbook-notes-${width}.png` });
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBe(width);
  });
}
