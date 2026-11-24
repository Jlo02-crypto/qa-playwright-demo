import { test, expect } from '../../fixtures/base';
import { LoginPage } from '../../pages/LoginPage';
import { InventoryPage } from '../../pages/InventoryPage';
import { users } from '../../fixtures/test-data';

test.describe('Login', () => {
  test('@smoke valid user reaches the product list', async ({ page }) => {
    const login = new LoginPage(page);
    const inventory = new InventoryPage(page);

    await login.goto();
    await login.login(users.standard.username, users.standard.password);

    await expect(page).toHaveURL(/inventory/);
    await expect(inventory.title).toHaveText('Products');
  });

  test('@smoke locked-out user sees an error and stays on login', async ({ page }) => {
    const login = new LoginPage(page);

    await login.goto();
    await login.login(users.lockedOut.username, users.lockedOut.password);

    await expect(login.error).toContainText('locked out');
    await expect(page).not.toHaveURL(/inventory/);
  });
});
