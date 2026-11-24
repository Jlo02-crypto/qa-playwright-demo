import { Page, Locator } from '@playwright/test';

export class CartPage {
  readonly items: Locator;
  readonly checkoutButton: Locator;

  constructor(private readonly page: Page) {
    this.items = page.locator('[data-test="inventory-item"]');
    this.checkoutButton = page.locator('[data-test="checkout"]');
  }

  async remove(productSlug: string) {
    await this.page.locator(`[data-test="remove-${productSlug}"]`).click();
  }

  async startCheckout() {
    await this.checkoutButton.click();
  }
}
