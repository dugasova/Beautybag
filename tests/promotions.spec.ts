import { test, expect } from '@playwright/test';

test.describe('Promotions page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/promotions');
  });

  test('renders page title', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Promotions' })).toBeVisible();
  });

  test('shows initial batch of 8 products', async ({ page }) => {
    const items = page.locator('.products-list > li');
    await expect(items).toHaveCount(8);
  });

  test('loads more products on scroll (infinite scroll)', async ({ page }) => {
    const items = page.locator('.products-list > li');
    await expect(items).toHaveCount(8);

    await page.locator('.loader-boundary').scrollIntoViewIfNeeded();

    await expect(items).toHaveCount(16, { timeout: 5000 });
  });

  test('shows loading indicator while fetching more', async ({ page }) => {
    const loader = page.locator('.loading-more-container');
    await expect(loader).toBeVisible();
  });
});
