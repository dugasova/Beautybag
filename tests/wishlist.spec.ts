import { test, expect } from '@playwright/test';

const TEST_EMAIL = `wishlist_test_${Date.now()}@e2etest.com`;
const TEST_PASSWORD = 'Test123456';

const login = async (page: import('@playwright/test').Page) => {
  await page.goto('/login');
  await page.locator('#email').fill(TEST_EMAIL);
  await page.locator('#password').fill(TEST_PASSWORD);
  await page.locator('.base-form button[type="submit"]').click();
  await expect(page).toHaveURL('/', { timeout: 15000 });
};

const goToProductAndAddToWishlist = async (page: import('@playwright/test').Page, productId = 1) => {
  await page.goto(`/product/${productId}`);
  await expect(page.locator('.product-title')).toBeVisible({ timeout: 10000 });
  const btn = page.locator('.wishlist-toggle-btn');
  await expect(btn).not.toHaveClass(/active/);
  await btn.click();
  await expect(btn).toHaveClass(/active/);
};

test.describe('Wishlist', () => {
  test.describe.configure({ mode: 'serial' });

  test('register test user', async ({ page }) => {
    await page.goto('/register');
    await page.locator('#email').fill(TEST_EMAIL);
    await page.locator('#password').fill(TEST_PASSWORD);
    await page.locator('.base-form button[type="submit"]').click();
    await expect(page).toHaveURL('/', { timeout: 15000 });
  });

  test('add product to wishlist from ProductPage', async ({ page }) => {
    await login(page);
    await goToProductAndAddToWishlist(page, 1);

    // Badge appears on wishlist icon in subheader
    await expect(page.locator('.wishlist-icons .badge-count')).toHaveText('1');

    // Navigate to wishlist page via subheader icon
    await page.locator('.wishlist-icons').click();
    await expect(page).toHaveURL('/wishlist');

    await expect(page.locator('.wishlist-item')).toHaveCount(1);
    await expect(page.locator('.wishlist-name')).toBeVisible();
    await expect(page.locator('.wishlist-price')).toBeVisible();
  });

  test('wishlist toggle removes product when clicked again on ProductPage', async ({ page }) => {
    await login(page);
    await goToProductAndAddToWishlist(page, 1);

    // Click again to remove
    const btn = page.locator('.wishlist-toggle-btn');
    await btn.click();
    await expect(btn).not.toHaveClass(/active/);

    // Wishlist badge should disappear
    await expect(page.locator('.wishlist-icons .badge-count')).toHaveCount(0);
  });

  test('remove product from wishlist page', async ({ page }) => {
    await login(page);
    await goToProductAndAddToWishlist(page, 1);

    await page.locator('.wishlist-icons').click();
    await expect(page).toHaveURL('/wishlist');
    await expect(page.locator('.wishlist-item')).toHaveCount(1);

    await page.getByRole('button', { name: 'Remove from wishlist' }).click();

    await expect(page.locator('.wishlist-item')).toHaveCount(0);
    await expect(page.locator('.wishlist-empty')).toBeVisible();
    await expect(page.getByText('Your wishlist is empty')).toBeVisible();
  });

  test('move product from wishlist to cart', async ({ page }) => {
    await login(page);
    await goToProductAndAddToWishlist(page, 1);

    await page.locator('.wishlist-icons').click();
    await expect(page).toHaveURL('/wishlist');
    await expect(page.locator('.wishlist-item')).toHaveCount(1);

    // Click "Add to cart" on the wishlist item
    await page.locator('.wishlist-item').getByRole('button', { name: 'Add to cart' }).click();

    // Cart badge should appear in subheader
    await expect(page.locator('.cart-icons .badge-count')).toBeVisible();

    // Navigate to cart and verify the product is there
    await page.locator('.cart-icons').click();
    await expect(page).toHaveURL('/cart');
    await expect(page.locator('.cart-item')).toHaveCount(1);
  });
});
