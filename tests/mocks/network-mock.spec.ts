import { test, expect } from '../../fixtures/base';

/**
 * Mock-first pattern, demonstrated in isolation.
 *
 * In a real project the application calls its own backend (pricing, stock,
 * promotions...). Mocking those responses lets a pipeline verify UI behaviour
 * deterministically BEFORE running the same flows against real environments.
 *
 * The practice site has no such API, so this test shows the mechanism itself:
 * intercept a request, return a controlled response, assert on it.
 */
test('@regression a mocked API response is returned deterministically', async ({ page }) => {
  await page.route('**/api/promotions', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ banner: 'MOCKED-PROMO', discountPercent: 10 }),
    }),
  );

  await page.goto('/');

  const result = await page.evaluate(async () => {
    const res = await fetch('/api/promotions');
    return res.json();
  });

  expect(result).toEqual({ banner: 'MOCKED-PROMO', discountPercent: 10 });
});

test('@regression a failing dependency can be simulated without touching it', async ({ page }) => {
  await page.route('**/api/promotions', (route) => route.fulfill({ status: 503 }));

  await page.goto('/');

  const status = await page.evaluate(async () => (await fetch('/api/promotions')).status);
  expect(status).toBe(503);
});
