import { Page, Locator } from '@playwright/test';

export class InventoryPage {
  readonly title: Locator;
  readonly cartBadge: Locator;
  readonly cartLink: Locator;

  constructor(private readonly page: Page) {
    this.title = page.locator('[data-test="title"]');
    this.cartBadge = page.locator('[data-test="shopping-cart-badge"]');
    this.cartLink = page.locator('[data-test="shopping-cart-link"]');
  }

  async addToCart(productSlug: string) {
    await this.page.locator(`[data-test="add-to-cart-${productSlug}"]`).click();
  }

  async openCart() {
    await this.cartLink.click();
  }
}
