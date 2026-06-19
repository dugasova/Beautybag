import { test, expect } from '@playwright/test';

const TEST_EMAIL = `buyer_flow_${Date.now()}@e2etest.com`;
const TEST_PASSWORD = 'Test123456';

const registerUser = async (page: import('@playwright/test').Page) => {
  await page.goto('/register');
  await page.locator('#email').fill(TEST_EMAIL);
  await page.locator('#password').fill(TEST_PASSWORD);
  await page.locator('.base-form button[type="submit"]').click();
  await expect(page).toHaveURL('/', { timeout: 15000 });
};

const loginUser = async (page: import('@playwright/test').Page) => {
  await page.goto('/login');
  await page.locator('#email').fill(TEST_EMAIL);
  await page.locator('#password').fill(TEST_PASSWORD);
  await page.locator('.base-form button[type="submit"]').click();
  await expect(page).toHaveURL('/', { timeout: 15000 });
};

test.describe('Buyer golden path: Home → Category → Product → Cart → Checkout → Success', () => {
  test.describe.configure({ mode: 'serial' });

  test('register a new test user', async ({ page }) => {
    await registerUser(page);
    await expect(page.locator('.actions').getByRole('button', { name: 'Account' })).toBeVisible({ timeout: 5000 });
  });

  test('full purchase flow end-to-end', async ({ page }) => {
    // --- Step 1: Login ---
    await loginUser(page);

    // --- Step 2: Home page — verify products loaded ---
    await expect(page.locator('.products-list')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('.product-item').first()).toBeVisible({ timeout: 10000 });

    // --- Step 3: Select category via navigation menu ---
    const hairMenu = page.locator('.navigation-item', { hasText: 'Hair' });
    await hairMenu.hover();
    await page.locator('.menu-item-nested', { hasText: 'Shampoos' }).click();
    await expect(page).toHaveURL('/category/Shampoos');
    await expect(page.locator('.search-results-title')).toContainText('Shampoos');

    // --- Step 4: Open product detail page ---
    await expect(page.locator('.product-item').first()).toBeVisible({ timeout: 10000 });
    await page.goto('/product/1');
    await expect(page.locator('.product-title')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('.product-status')).toHaveText('In Stock');

    // --- Step 5: Add to cart from product page ---
    const addToCartBtn = page.locator('.add-to-cart-big');
    await expect(addToCartBtn).toBeVisible();
    await addToCartBtn.click();
    await expect(addToCartBtn).toContainText('(1)');

    // --- Step 6: Navigate to cart via subheader icon ---
    await page.locator('.cart-icons').click();
    await expect(page).toHaveURL('/cart');

    // --- Step 7: Verify cart contents ---
    await expect(page.locator('.cart-title')).toBeVisible();
    await expect(page.locator('.cart-grid')).toBeVisible();
    await expect(page.locator('.cart-summary-header')).toBeVisible();

    // --- Step 8: Proceed to checkout ---
    await page.locator('.checkout-btn').click();
    await expect(page).toHaveURL('/checkout');

    // --- Step 9: Shipping step — fill the form ---
    await expect(page.locator('.step.active')).toContainText('1. Shipping');
    await page.locator('#firstName').fill('John');
    await page.locator('#lastName').fill('Doe');
    await page.locator('#address').fill('123 Main Street, Apt 4');
    await page.locator('#city').fill('Kyiv');
    await page.locator('#phone').fill('0501234567');
    await page.getByRole('button', { name: 'Continue to Payment' }).click();

    // --- Step 10: Payment step — select payment method ---
    await expect(page.locator('.step.active').last()).toContainText('2. Payment');
    await page.locator('.payment-option', { hasText: 'Credit / Debit Card' }).click();
    await expect(page.locator('.payment-option.active')).toContainText('Credit / Debit Card');
    await page.getByRole('button', { name: 'Review Order' }).click();

    // --- Step 11: Review step — verify order details ---
    await expect(page.locator('.step.active').last()).toContainText('3. Review');
    await expect(page.getByText('Shipping to:')).toBeVisible();
    await expect(page.getByText('John Doe')).toBeVisible();
    await expect(page.getByText('123 Main Street, Apt 4, Kyiv')).toBeVisible();
    await expect(page.getByText('0501234567')).toBeVisible();
    await expect(page.getByText('Payment Method:')).toBeVisible();
    await expect(page.getByText('Card')).toBeVisible();
    await expect(page.getByText('Items:')).toBeVisible();
    await expect(page.locator('.review-item')).toHaveCount(1);
    await expect(page.locator('.total-row')).toContainText('UAH');

    // --- Step 12: Place order ---
    await page.getByRole('button', { name: 'Place Order' }).click();

    // --- Step 13: Order Success page ---
    await expect(page).toHaveURL('/order-success', { timeout: 15000 });
    await expect(page.getByRole('heading', { name: /Thank You for Your Order/ })).toBeVisible();
    await expect(page.getByText('Order ID:')).toBeVisible();
    await expect(page.getByText(/received your order/)).toBeVisible();
    await expect(page.getByRole('button', { name: 'Continue Shopping' })).toBeVisible();

    // --- Step 14: Return to home ---
    await page.getByRole('button', { name: 'Continue Shopping' }).click();
    await expect(page).toHaveURL('/');
  });
});
