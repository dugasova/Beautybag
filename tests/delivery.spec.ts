import { test, expect } from '@playwright/test';

test.describe('Delivery page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/delivery');
  });

  test('renders page title and subtitle', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Delivery and Payments' })).toBeVisible();
    await expect(page.getByText('We ensure your beauty treats arrive safely and on time.')).toBeVisible();
  });

  test('displays all 3 delivery methods', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Delivery Options' })).toBeVisible();

    await expect(page.getByRole('heading', { name: 'Courier Delivery' })).toBeVisible();
    await expect(page.getByText('1-2 business days')).toBeVisible();
    await expect(page.getByText('50 UAH')).toBeVisible();

    await expect(page.getByRole('heading', { name: 'Post Office' })).toBeVisible();
    await expect(page.getByText('2-4 business days')).toBeVisible();
    await expect(page.getByText('30 UAH')).toBeVisible();

    await expect(page.getByRole('heading', { name: 'Boutique Pickup' })).toBeVisible();
    await expect(page.getByText('Same day')).toBeVisible();
    await expect(page.getByText('Free')).toBeVisible();
  });

  test('displays all 3 payment methods', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Payment Methods' })).toBeVisible();

    await expect(page.getByRole('heading', { name: 'Credit Card' })).toBeVisible();
    await expect(page.getByText('Visa, MasterCard, or Apple Pay')).toBeVisible();

    const paymentCards = page.locator('.payment-card');
    await expect(paymentCards).toHaveCount(3);
  });
});
