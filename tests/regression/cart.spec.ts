import { test, expect } from '../../fixtures/base';
import { LoginPage } from '../../pages/LoginPage';
import { InventoryPage } from '../../pages/InventoryPage';
import { CartPage } from '../../pages/CartPage';
import { CheckoutPage } from '../../pages/CheckoutPage';
import { users, customer, products } from '../../fixtures/test-data';

test.describe('Cart and checkout rules', () => {
  test.beforeEach(async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.login(users.standard.username, users.standard.password);
  });

  test('@regression cart badge follows items added and removed', async ({ page }) => {
    const inventory = new InventoryPage(page);
    const cart = new CartPage(page);

    await inventory.addToCart(products.backpack);
    await inventory.addToCart(products.bikeLight);
    await expect(inventory.cartBadge).toHaveText('2');

    await inventory.openCart();
    await expect(cart.items).toHaveCount(2);

    await cart.remove(products.backpack);
    await expect(cart.items).toHaveCount(1);
  });

  test('@regression checkout requires customer information', async ({ page }) => {
    const inventory = new InventoryPage(page);
    const cart = new CartPage(page);
    const checkout = new CheckoutPage(page);

    await inventory.addToCart(products.backpack);
    await inventory.openCart();
    await cart.startCheckout();

    await checkout.continue(); // submit empty form
    await expect(checkout.error).toContainText('First Name is required');
  });
});
