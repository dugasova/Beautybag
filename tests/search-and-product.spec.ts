import { test, expect } from '@playwright/test';

const openSearch = async (page: import('@playwright/test').Page) => {
  await page.goto('/');
  await expect(page.locator('.products-list')).toBeVisible({ timeout: 10000 });
  await page.locator('.subheader-search-btn').click();
  await expect(page.locator('.search-modal')).toBeVisible();
};

test.describe('Search modal', () => {
  test('opens on search icon click and closes on close button', async ({ page }) => {
    await openSearch(page);

    await page.locator('.search-modal-close').click();
    await expect(page.locator('.search-modal')).not.toBeVisible();
  });

  test('input with < 3 characters shows no results container', async ({ page }) => {
    await openSearch(page);

    await page.locator('.search-input').fill('Sh');
    await expect(page.locator('.search-results-container')).not.toBeVisible();
  });

  test('input with 3+ characters shows search results', async ({ page }) => {
    await openSearch(page);

    await page.locator('.search-input').fill('Sha');
    await expect(page.locator('.search-results-container')).toBeVisible();
    await expect(page.locator('.search-result-item').first()).toBeVisible();
    await expect(page.locator('.result-name').first()).toContainText('Shampoo');
  });

  test('no matching query shows "No results found"', async ({ page }) => {
    await openSearch(page);

    await page.locator('.search-input').fill('xyznonexistent');
    await expect(page.locator('.search-no-results')).toBeVisible();
    await expect(page.locator('.search-no-results')).toContainText('No results found');
  });

  test('click on search result navigates to product page', async ({ page }) => {
    await openSearch(page);

    await page.locator('.search-input').fill('Shampoo');
    await expect(page.locator('.search-result-item').first()).toBeVisible();

    await page.locator('.search-result-item').first().click();

    await expect(page).toHaveURL(/\/product\/\d+/);
    await expect(page.locator('.search-modal')).not.toBeVisible();
    await expect(page.locator('.product-title')).toBeVisible();
  });

  test('results update as user types', async ({ page }) => {
    await openSearch(page);

    await page.locator('.search-input').fill('Hair');
    await expect(page.locator('.search-result-item').first()).toBeVisible();
    const countAll = await page.locator('.search-result-item').count();
    expect(countAll).toBeGreaterThan(1);

    await page.locator('.search-input').fill('Hair Mask');
    await expect(page.locator('.search-results-container')).toBeVisible();
    const countFiltered = await page.locator('.search-result-item').count();
    expect(countFiltered).toBeLessThan(countAll);
  });
});

test.describe('Product page (/product/:id)', () => {
  test('displays all product information', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.products-list')).toBeVisible({ timeout: 10000 });

    await page.goto('/product/1');
    await expect(page.locator('.product-title')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('.product-status')).toHaveText('In Stock');
    await expect(page.locator('.current-price')).toContainText('UAH');
    await expect(page.locator('.stars')).toBeVisible();
    await expect(page.locator('.rating-value')).toBeVisible();
    await expect(page.locator('.product-description-long')).toBeVisible();
    await expect(page.locator('.product-image-main img')).toBeVisible();
  });

  test('breadcrumb shows Home / Category / Product', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.products-list')).toBeVisible({ timeout: 10000 });

    await page.goto('/product/1');
    await expect(page.locator('.product-title')).toBeVisible({ timeout: 10000 });

    const breadcrumb = page.locator('.breadcrumb');
    await expect(breadcrumb).toBeVisible();
    await expect(breadcrumb).toContainText('Home');
    await expect(breadcrumb.locator('.separator')).toHaveCount(2);
  });

  test('breadcrumb Home click navigates to /', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.products-list')).toBeVisible({ timeout: 10000 });

    await page.goto('/product/1');
    await expect(page.locator('.product-title')).toBeVisible({ timeout: 10000 });

    await page.locator('.breadcrumb span').first().click();
    await expect(page).toHaveURL('/');
  });

  test('shows volume when product has one', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.products-list')).toBeVisible({ timeout: 10000 });

    await page.goto('/product/1');
    await expect(page.locator('.product-title')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('.product-volume')).toContainText('ml');
  });

  test('add to cart button updates counter on repeated clicks', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.products-list')).toBeVisible({ timeout: 10000 });

    await page.goto('/product/1');
    await expect(page.locator('.product-title')).toBeVisible({ timeout: 10000 });

    const btn = page.locator('.add-to-cart-big');
    await expect(btn).toHaveText('Add to cart');

    await btn.click();
    await expect(btn).toContainText('(1)');

    await btn.click();
    await expect(btn).toContainText('(2)');
  });

  test('wishlist toggle works', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.products-list')).toBeVisible({ timeout: 10000 });

    await page.goto('/product/1');
    await expect(page.locator('.product-title')).toBeVisible({ timeout: 10000 });

    const btn = page.locator('.wishlist-toggle-btn');
    await expect(btn).not.toHaveClass(/active/);

    await btn.click();
    await expect(btn).toHaveClass(/active/);

    await btn.click();
    await expect(btn).not.toHaveClass(/active/);
  });

  test('non-existent product shows error', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.products-list')).toBeVisible({ timeout: 10000 });

    await page.goto('/product/99999');
    await expect(page.getByText('Product Not Found')).toBeVisible({ timeout: 10000 });
    await expect(page.getByRole('button', { name: 'Back to Home' })).toBeVisible();
  });

  test('"Back to Home" from error page works', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.products-list')).toBeVisible({ timeout: 10000 });

    await page.goto('/product/99999');
    await expect(page.getByText('Product Not Found')).toBeVisible({ timeout: 10000 });

    await page.getByRole('button', { name: 'Back to Home' }).click();
    await expect(page).toHaveURL('/');
  });

  test('product features section is visible', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.products-list')).toBeVisible({ timeout: 10000 });

    await page.goto('/product/1');
    await expect(page.locator('.product-title')).toBeVisible({ timeout: 10000 });

    await expect(page.getByText('Free Delivery')).toBeVisible();
    await expect(page.getByText('100% Genuine')).toBeVisible();
  });
});
