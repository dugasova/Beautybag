import { test, expect } from '@playwright/test';

const TEST_EMAIL = `cart_test_${Date.now()}@e2etest.com`;
const TEST_PASSWORD = 'Test123456';

const login = async (page: import('@playwright/test').Page) => {
  await page.goto('/login');
  await page.locator('#email').fill(TEST_EMAIL);
  await page.locator('#password').fill(TEST_PASSWORD);
  await page.locator('.base-form button[type="submit"]').click();
  await expect(page).toHaveURL('/', { timeout: 15000 });
};

const addProductAndGoToCart = async (page: import('@playwright/test').Page, productId = 1) => {
  await page.goto(`/product/${productId}`);
  await expect(page.locator('.product-title')).toBeVisible({ timeout: 10000 });
  await page.locator('.add-to-cart-big').click();
  await expect(page.locator('.add-to-cart-big')).toContainText('(');
  await page.locator('.cart-icons').click();
  await expect(page).toHaveURL('/cart');
};

test.describe('Cart page', () => {
  test.describe.configure({ mode: 'serial' });

  test('register test user', async ({ page }) => {
    await page.goto('/register');
    await page.locator('#email').fill(TEST_EMAIL);
    await page.locator('#password').fill(TEST_PASSWORD);
    await page.locator('.base-form button[type="submit"]').click();
    await expect(page).toHaveURL('/', { timeout: 15000 });
  });

  test('empty cart shows empty state', async ({ page }) => {
    await login(page);
    await page.locator('.cart-icons').click();
    await expect(page).toHaveURL('/cart');

    await expect(page.locator('.cart-empty')).toBeVisible();
    await expect(page.getByText('Your cart is empty')).toBeVisible();
    await expect(page.getByText('Add some products to your cart')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Back to products' })).toBeVisible();
  });

  test('empty state "Back to products" navigates to home', async ({ page }) => {
    await login(page);
    await page.locator('.cart-icons').click();

    await page.getByRole('button', { name: 'Back to products' }).click();
    await expect(page).toHaveURL('/');
  });

  test('add product and verify it appears in cart', async ({ page }) => {
    await login(page);
    await addProductAndGoToCart(page, 1);

    await expect(page.locator('.cart-grid')).toBeVisible();
    await expect(page.locator('.cart-item')).toHaveCount(1);
    await expect(page.locator('.cart-quantity-display')).toHaveText('1');
    await expect(page.locator('.cart-summary-header')).toBeVisible();
  });

  test('increase quantity with + button', async ({ page }) => {
    await login(page);
    await addProductAndGoToCart(page, 1);

    await expect(page.locator('.cart-quantity-display')).toHaveText('1');

    await page.locator('.cart-quantity-btn', { hasText: '+' }).click();
    await expect(page.locator('.cart-quantity-display')).toHaveText('2');

    await page.locator('.cart-quantity-btn', { hasText: '+' }).click();
    await expect(page.locator('.cart-quantity-display')).toHaveText('3');
  });

  test('decrease quantity with - button', async ({ page }) => {
    await login(page);
    await addProductAndGoToCart(page, 1);

    await page.locator('.cart-quantity-btn', { hasText: '+' }).click();
    await expect(page.locator('.cart-quantity-display')).toHaveText('2');

    await page.locator('.cart-quantity-btn', { hasText: '-' }).click();
    await expect(page.locator('.cart-quantity-display')).toHaveText('1');
  });

  test('quantity does not go below 1', async ({ page }) => {
    await login(page);
    await addProductAndGoToCart(page, 1);

    await expect(page.locator('.cart-quantity-display')).toHaveText('1');

    await page.locator('.cart-quantity-btn', { hasText: '-' }).click();
    await expect(page.locator('.cart-quantity-display')).toHaveText('1');
    await expect(page.locator('.cart-item')).toHaveCount(1);
  });

  test('remove product from cart shows empty state', async ({ page }) => {
    await login(page);
    await addProductAndGoToCart(page, 1);

    await expect(page.locator('.cart-item')).toHaveCount(1);

    await page.locator('.remove-from-cart').click();
    await expect(page.locator('.cart-item')).toHaveCount(0);
    await expect(page.locator('.cart-empty')).toBeVisible();
  });

  test('clear cart removes all items', async ({ page }) => {
    await login(page);
    await expect(page.locator('.product-item').first()).toBeVisible({ timeout: 10000 });

    const firstProduct = page.locator('.product-item').nth(0);
    await firstProduct.hover();
    await firstProduct.locator('.product-button-custom').click();

    const secondProduct = page.locator('.product-item').nth(1);
    await secondProduct.hover();
    await secondProduct.locator('.product-button-custom').click();

    await page.locator('.cart-icons').click();
    await expect(page).toHaveURL('/cart');
    await expect(page.locator('.cart-item')).toHaveCount(2);

    await page.locator('.clear-cart-btn').click();
    await expect(page.locator('.cart-item')).toHaveCount(0);
    await expect(page.locator('.cart-empty')).toBeVisible();
  });

  test('subtotal updates when quantity changes', async ({ page }) => {
    await login(page);
    await addProductAndGoToCart(page, 1);

    const cartItem = page.locator('.cart-item').first();
    const qtyBefore = await cartItem.locator('.cart-quantity-display').textContent();
    const subtotalBefore = await cartItem.locator('.total-item-price').textContent();

    await cartItem.locator('.cart-quantity-btn', { hasText: '+' }).click();

    const expectedQty = String(Number(qtyBefore) + 1);
    await expect(cartItem.locator('.cart-quantity-display')).toHaveText(expectedQty);

    const subtotalAfter = await cartItem.locator('.total-item-price').textContent();
    expect(subtotalBefore).not.toBe(subtotalAfter);
  });

  test('header summary updates on quantity change', async ({ page }) => {
    await login(page);
    await addProductAndGoToCart(page, 1);

    await expect(page.locator('.cart-summary-header .total-amount')).toContainText('UAH');

    const cartItem = page.locator('.cart-item').first();
    const totalBefore = await page.locator('.cart-summary-header .total-amount').textContent();

    await cartItem.locator('.cart-quantity-btn', { hasText: '+' }).click();

    await expect(page.locator('.cart-summary-header .total-amount')).not.toHaveText(totalBefore!);
  });
});
