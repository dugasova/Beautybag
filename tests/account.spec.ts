import { test, expect } from '@playwright/test';

const TEST_EMAIL = `account_test_${Date.now()}@e2etest.com`;
const TEST_PASSWORD = 'Test123456';

const login = async (page: import('@playwright/test').Page) => {
  await page.goto('/login');
  await page.locator('#email').fill(TEST_EMAIL);
  await page.locator('#password').fill(TEST_PASSWORD);
  await page.locator('.base-form button[type="submit"]').click();
  await expect(page).toHaveURL('/', { timeout: 15000 });
};

const goToAccount = async (page: import('@playwright/test').Page) => {
  await login(page);
  await page.goto('/account');
  await expect(page.locator('.account-page')).toBeVisible({ timeout: 10000 });
};


test.describe('Account page', () => {
  test.describe.configure({ mode: 'serial' });

  test('register test user', async ({ page }) => {
    await page.goto('/register');
    await page.locator('#email').fill(TEST_EMAIL);
    await page.locator('#password').fill(TEST_PASSWORD);
    await page.locator('.base-form button[type="submit"]').click();
    await expect(page).toHaveURL('/', { timeout: 15000 });
  });

  test('account page shows user email and tabs', async ({ page }) => {
    await goToAccount(page);

    await expect(page.locator('.account-email')).toContainText(TEST_EMAIL);
    await expect(page.locator('.acc-tab', { hasText: 'Your Orders' })).toBeVisible();
    await expect(page.locator('.acc-tab', { hasText: 'Profile' })).toBeVisible();
    await expect(page.locator('.acc-tab', { hasText: 'Addresses' })).toBeVisible();
  });

  // ── Profile tab ──

  test('Profile tab: displays form fields', async ({ page }) => {
    await goToAccount(page);

    await page.locator('.acc-tab', { hasText: 'Profile' }).click();
    await expect(page.locator('.profile-section')).toBeVisible();
    await expect(page.locator('#profile-displayName')).toBeVisible();
    await expect(page.locator('#profile-phone')).toBeVisible();
    await expect(page.locator('#profile-email')).toBeVisible();
    await expect(page.locator('.save-btn')).toBeVisible();
  });

  test('Profile tab: email field is read-only and shows user email', async ({ page }) => {
    await goToAccount(page);

    await page.locator('.acc-tab', { hasText: 'Profile' }).click();
    await expect(page.locator('#profile-email')).toHaveAttribute('readonly', '');
    await expect(page.locator('#profile-email')).toHaveValue(TEST_EMAIL);
  });


  // ── Addresses tab ──

  test('Addresses tab: initially shows empty state', async ({ page }) => {
    await goToAccount(page);

    await page.locator('.acc-tab', { hasText: 'Addresses' }).click();
    await expect(page.locator('.addresses-section')).toBeVisible();
    await expect(page.getByText('No saved addresses yet.')).toBeVisible();
    await expect(page.locator('.add-addr-btn')).toBeVisible();
  });

  test('Addresses tab: add new address', async ({ page }) => {
    await goToAccount(page);

    await page.locator('.acc-tab', { hasText: 'Addresses' }).click();
    await page.locator('.add-addr-btn').click();
    await expect(page.locator('.address-form')).toBeVisible();

    await page.locator('#address-label').fill('Home');
    await page.locator('#address-firstName').fill('John');
    await page.locator('#address-lastName').fill('Doe');
    await page.locator('#address-address').fill('123 Main Street');
    await page.locator('#address-city').fill('Kyiv');
    await page.locator('#address-phone').fill('0501234567');
    await page.locator('.address-form .save-btn').click();

    await expect(page.locator('.address-form')).not.toBeVisible({ timeout: 10000 });
    await expect(page.locator('.address-card')).toHaveCount(1);
    await expect(page.locator('.address-card')).toContainText('John Doe');
    await expect(page.locator('.address-card')).toContainText('123 Main Street');
    await expect(page.locator('.address-card')).toContainText('Kyiv');
  });

  test('Addresses tab: cancel hides the form', async ({ page }) => {
    await goToAccount(page);

    await page.locator('.acc-tab', { hasText: 'Addresses' }).click();
    await page.locator('.add-addr-btn').click();
    await expect(page.locator('.address-form')).toBeVisible();

    await page.locator('.cancel-btn').click();
    await expect(page.locator('.address-form')).not.toBeVisible();
  });

  test('Addresses tab: delete address', async ({ page }) => {
    await goToAccount(page);

    await page.locator('.acc-tab', { hasText: 'Addresses' }).click();
    await expect(page.locator('.address-card')).toHaveCount(1, { timeout: 10000 });

    await page.locator('.delete-addr-btn').click();
    await expect(page.locator('.address-card')).toHaveCount(0);
    await expect(page.getByText('No saved addresses yet.')).toBeVisible();
  });

  // ── Orders tab ──

  test('Orders tab: shows "No orders" for fresh user', async ({ page }) => {
    await goToAccount(page);

    await expect(page.locator('.acc-tab', { hasText: 'Your Orders' })).toHaveClass(/active/);
    await expect(page.getByText('No orders found.')).toBeVisible();
  });

  test('Orders tab: shows order after purchase, and name appears in header', async ({ page }) => {
    await login(page);

    // Complete a purchase — shipping form fill works with react-hook-form
    await page.goto('/product/1');
    await expect(page.locator('.product-title')).toBeVisible({ timeout: 10000 });
    await page.locator('.add-to-cart-big').click();
    await page.locator('.cart-icons').click();
    await expect(page).toHaveURL('/cart');
    await page.locator('.checkout-btn').click();
    await expect(page).toHaveURL('/checkout');

    await page.locator('#firstName').fill('John');
    await page.locator('#lastName').fill('Doe');
    await page.locator('#address').fill('123 Main Street');
    await page.locator('#city').fill('Kyiv');
    await page.locator('#phone').fill('0501234567');
    await page.getByRole('button', { name: 'Continue to Payment' }).click();

    await page.locator('.payment-option', { hasText: 'Cash on Delivery' }).click();
    await page.getByRole('button', { name: 'Review Order' }).click();

    await page.getByRole('button', { name: 'Place Order' }).click();
    await expect(page).toHaveURL('/order-success', { timeout: 15000 });

    // Go to account — check orders and name from shipping address
    await page.goto('/account');
    await expect(page.locator('.account-page')).toBeVisible({ timeout: 10000 });

    // Name from order's shippingAddress should appear in header
    await expect(page.locator('.account-title')).toContainText('John', { timeout: 10000 });

    // Orders tab shows the order
    await expect(page.locator('.order-card')).toHaveCount(1, { timeout: 10000 });
    await expect(page.locator('.order-id')).toBeVisible();
    await expect(page.locator('.order-status')).toBeVisible();
    await expect(page.locator('.order-item-row')).toBeVisible();
    await expect(page.locator('.order-footer')).toContainText('UAH');
  });
});
