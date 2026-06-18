import { test, expect } from '@playwright/test';

test.describe('Language switching', () => {
  test('switches from EN to UK and back', async ({ page }) => {
    await page.goto('/delivery');

    await expect(page.getByRole('heading', { name: 'Delivery and Payments' })).toBeVisible();
    await expect(page.locator('.nav-link', { hasText: 'Contact' })).toBeVisible();

    const langBtn = page.locator('.language-btn-custom');
    await expect(langBtn).toHaveText('UK');

    await langBtn.click();

    await expect(langBtn).toHaveText('EN');
    await expect(page.getByRole('heading', { name: 'Доставка та оплата' })).toBeVisible();
    await expect(page.locator('.nav-link', { hasText: 'Контакти' })).toBeVisible();

    await langBtn.click();

    await expect(langBtn).toHaveText('UK');
    await expect(page.getByRole('heading', { name: 'Delivery and Payments' })).toBeVisible();
  });

  test('language persists across navigation', async ({ page }) => {
    await page.goto('/delivery');

    await page.locator('.language-btn-custom').click();
    await expect(page.getByRole('heading', { name: 'Доставка та оплата' })).toBeVisible();

    await page.locator('.nav-link', { hasText: 'Контакти' }).click();

    await expect(page.getByRole('heading', { name: "Зв'яжіться з нами" })).toBeVisible();
  });
});

test.describe('Theme switching', () => {
  test('toggles from light to dark theme', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.setItem('theme', 'light'));
    await page.reload();

    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');

    const toggle = page.locator('.theme-toggle');
    await toggle.click();

    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  });

  test('toggles from dark back to light', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.setItem('theme', 'dark'));
    await page.reload();

    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

    const toggle = page.locator('.theme-toggle');
    await toggle.click();

    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  });

  test('theme persists after page reload', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.setItem('theme', 'light'));
    await page.reload();

    await page.locator('.theme-toggle').click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

    await page.reload();

    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  });

  test('theme toggle updates aria-pressed attribute', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.setItem('theme', 'light'));
    await page.reload();

    const toggle = page.locator('.theme-toggle');
    await expect(toggle).toHaveAttribute('aria-pressed', 'false');

    await toggle.click();

    await expect(toggle).toHaveAttribute('aria-pressed', 'true');
  });
});
