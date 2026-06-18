import { test, expect, type Page } from '@playwright/test';

const getProductPrices = async (page: Page): Promise<number[]> => {
  const priceTexts = await page.locator('.product-item .product-price.current, .product-item .product-price:not(.old)').allTextContents();
  return priceTexts.map((t) => parseInt(t.replace(/[^\d]/g, ''), 10)).filter((n) => !isNaN(n));
};

const getProductCategories = async (page: Page): Promise<string[]> => {
  return page.locator('.product-item .product-category').allTextContents();
};

test.describe('Product filters', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.locator('.product-item').first().waitFor();
  });

  test.describe('Category filter', () => {
    test('filters products by category via menu', async ({ page }) => {
      const menuItem = page.locator('.navigation-item', { hasText: 'Hair' });
      await menuItem.hover();
      await page.locator('.menu-item-nested', { hasText: 'Shampoos' }).click();

      await expect(page).toHaveURL(/\/category\/Shampoos/);
      await expect(page.getByText('Category: Shampoos')).toBeVisible();

      const categories = await getProductCategories(page);
      expect(categories.length).toBeGreaterThan(0);
      for (const cat of categories) {
        expect(cat).toBe('Hair');
      }
    });

    test('shows "Show all" button and clears filter', async ({ page }) => {
      await page.goto('/category/Hair');
      await page.locator('.product-item').first().waitFor();

      const showAllBtn = page.getByRole('button', { name: 'Show all products' });
      await expect(showAllBtn).toBeVisible();
      await showAllBtn.click();

      await expect(page).toHaveURL('/');
    });
  });

  test.describe('Sort by price', () => {
    test('sorts products price low to high', async ({ page }) => {
      await page.locator('#sort-by').selectOption('price-asc');

      await page.waitForTimeout(300);
      const prices = await getProductPrices(page);
      expect(prices.length).toBeGreaterThan(1);

      for (let i = 1; i < prices.length; i++) {
        expect(prices[i]).toBeGreaterThanOrEqual(prices[i - 1]);
      }
    });

    test('sorts products price high to low', async ({ page }) => {
      await page.locator('#sort-by').selectOption('price-desc');

      await page.waitForTimeout(300);
      const prices = await getProductPrices(page);
      expect(prices.length).toBeGreaterThan(1);

      for (let i = 1; i < prices.length; i++) {
        expect(prices[i]).toBeLessThanOrEqual(prices[i - 1]);
      }
    });
  });

  test.describe('Sort by rating', () => {
    test('sorts products by rating descending', async ({ page }) => {
      await page.locator('#sort-by').selectOption('rating-desc');

      await page.waitForTimeout(300);
      const items = page.locator('.product-item');
      const count = await items.count();
      expect(count).toBeGreaterThan(1);

      const ratings: number[] = [];
      for (let i = 0; i < Math.min(count, 8); i++) {
        const filledStars = await items.nth(i).locator('.star.filled, .star.star-half').count();
        ratings.push(filledStars);
      }

      for (let i = 1; i < ratings.length; i++) {
        expect(ratings[i]).toBeLessThanOrEqual(ratings[i - 1]);
      }
    });
  });

  test.describe('Price range filter', () => {
    test('filters by minimum price', async ({ page }) => {
      const minInput = page.getByLabel('Minimum price');
      await minInput.fill('200');

      await page.waitForTimeout(300);
      const prices = await getProductPrices(page);
      expect(prices.length).toBeGreaterThan(0);

      for (const price of prices) {
        expect(price).toBeGreaterThanOrEqual(200);
      }
    });

    test('filters by maximum price', async ({ page }) => {
      const maxInput = page.getByLabel('Maximum price');
      await maxInput.fill('150');

      await page.waitForTimeout(300);
      const prices = await getProductPrices(page);
      expect(prices.length).toBeGreaterThan(0);

      for (const price of prices) {
        expect(price).toBeLessThanOrEqual(150);
      }
    });

    test('filters by min and max price range', async ({ page }) => {
      await page.getByLabel('Minimum price').fill('100');
      await page.getByLabel('Maximum price').fill('200');

      await page.waitForTimeout(300);
      const prices = await getProductPrices(page);
      expect(prices.length).toBeGreaterThan(0);

      for (const price of prices) {
        expect(price).toBeGreaterThanOrEqual(100);
        expect(price).toBeLessThanOrEqual(200);
      }
    });
  });

  test.describe('Rating filter', () => {
    test('filters by minimum rating', async ({ page }) => {
      await page.getByRole('button', { name: '4 stars & up' }).click();

      await page.waitForTimeout(300);
      const items = page.locator('.product-item');
      const count = await items.count();
      expect(count).toBeGreaterThan(0);

      for (let i = 0; i < Math.min(count, 8); i++) {
        const filledStars = await items.nth(i).locator('.star.filled, .star.star-half').count();
        expect(filledStars).toBeGreaterThanOrEqual(4);
      }
    });

    test('toggles rating off when clicked again', async ({ page }) => {
      const star4 = page.getByRole('button', { name: '4 stars & up' });

      await star4.click();
      await page.waitForTimeout(300);
      const countAfterFilter = await page.locator('.product-item').count();

      await star4.click();
      await page.waitForTimeout(300);
      const countAfterClear = await page.locator('.product-item').count();

      expect(countAfterClear).toBeGreaterThanOrEqual(countAfterFilter);
    });
  });

  test.describe('Reset filters', () => {
    test('resets all filters to defaults', async ({ page }) => {
      await page.locator('#sort-by').selectOption('price-asc');
      await page.getByLabel('Minimum price').fill('100');
      await page.getByLabel('Maximum price').fill('300');
      await page.getByRole('button', { name: '3 stars & up' }).click();

      await page.waitForTimeout(300);
      const filteredCount = await page.locator('.product-item').count();

      await page.getByRole('button', { name: 'Reset Filters' }).click();

      await page.waitForTimeout(300);

      await expect(page.locator('#sort-by')).toHaveValue('default');
      await expect(page.getByLabel('Minimum price')).toHaveValue('');
      await expect(page.getByLabel('Maximum price')).toHaveValue('');

      const star3 = page.getByRole('button', { name: '3 stars & up' });
      await expect(star3).toHaveAttribute('aria-pressed', 'false');

      const resetCount = await page.locator('.product-item').count();
      expect(resetCount).toBeGreaterThanOrEqual(filteredCount);
    });
  });
});
