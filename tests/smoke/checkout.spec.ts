import { test, expect } from '../../fixtures/base';
import { LoginPage } from '../../pages/LoginPage';
import { InventoryPage } from '../../pages/InventoryPage';
import { CartPage } from '../../pages/CartPage';
import { CheckoutPage } from '../../pages/CheckoutPage';
import { users, customer, products } from '../../fixtures/test-data';

// The revenue-critical path: login -> cart -> checkout -> order confirmed.
test('@smoke customer can complete a purchase end to end', async ({ page }) => {
  const login = new LoginPage(page);
  const inventory = new InventoryPage(page);
  const cart = new CartPage(page);
  const checkout = new CheckoutPage(page);

  await login.goto();
  await login.login(users.standard.username, users.standard.password);

  await inventory.addToCart(products.backpack);
  await expect(inventory.cartBadge).toHaveText('1');
  await inventory.openCart();

  await expect(cart.items).toHaveCount(1);
  await cart.startCheckout();

  await checkout.fillCustomer(customer);
  await checkout.continue();
  await expect(page).toHaveURL(/checkout-step-two/);
  await checkout.finish();

  await expect(checkout.completeHeader).toHaveText('Thank you for your order!');
});
