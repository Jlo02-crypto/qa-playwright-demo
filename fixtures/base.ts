import { test as base, expect } from '@playwright/test';

/**
 * Shared test fixture.
 *
 * Mock-first principle: tests should fail because of the product, not because
 * of a third-party service we don't control. The practice site sends error
 * telemetry to an external host; we abort those calls for every test so they
 * cannot add noise or flakiness to the run.
 */
export const test = base.extend<{ stubThirdParty: void }>({
  stubThirdParty: [
    async ({ context }, use) => {
      await context.route(/backtrace\.io/, (route) => route.abort());
      await use();
    },
    { auto: true },
  ],
});

export { expect };
