import { test, expect } from '@playwright/test';

test.describe('Header navigation links', () => {
  test('Promotions link navigates to /promotions', async ({ page }) => {
    await page.goto('/');
    await page.locator('.nav-link', { hasText: 'Promotions' }).click();
    await expect(page).toHaveURL('/promotions');
    await expect(page.getByRole('heading', { name: 'Promotions' })).toBeVisible();
  });

  test('Delivery link navigates to /delivery', async ({ page }) => {
    await page.goto('/');
    await page.locator('.nav-link', { hasText: 'Delivery and payments' }).click();
    await expect(page).toHaveURL('/delivery');
    await expect(page.getByRole('heading', { name: 'Delivery and Payments' })).toBeVisible();
  });

  test('Contact link navigates to /contact', async ({ page }) => {
    await page.goto('/');
    await page.locator('.nav-link', { hasText: 'Contact' }).click();
    await expect(page).toHaveURL('/contact');
    await expect(page.getByRole('heading', { name: 'Contact Us' })).toBeVisible();
  });

  test('Logo navigates to home page', async ({ page }) => {
    await page.goto('/delivery');
    await page.locator('.logo a').click();
    await expect(page).toHaveURL('/');
  });

  test('Log In button navigates to /login', async ({ page }) => {
    await page.goto('/');
    await page.locator('.actions').getByRole('button', { name: 'Log In' }).click();
    await expect(page).toHaveURL('/login');
  });

  test('Sign Up button navigates to /register', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Sign Up' }).click();
    await expect(page).toHaveURL('/register');
  });
});

test.describe('Breadcrumbs', () => {
  test('not shown on home page', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.breadcrumbs')).not.toBeVisible();
  });

  test('shown on /delivery with correct path', async ({ page }) => {
    await page.goto('/delivery');
    const breadcrumbs = page.locator('.breadcrumbs');
    await expect(breadcrumbs).toBeVisible();

    await expect(breadcrumbs.getByLabel('Home')).toBeVisible();
    await expect(breadcrumbs.getByText('Delivery and payments')).toBeVisible();
  });

  test('shown on /contact with correct path', async ({ page }) => {
    await page.goto('/contact');
    const breadcrumbs = page.locator('.breadcrumbs');
    await expect(breadcrumbs).toBeVisible();
    await expect(breadcrumbs.getByText('Contact')).toBeVisible();
  });

  test('last breadcrumb segment is not a link', async ({ page }) => {
    await page.goto('/delivery');
    const current = page.locator('.breadcrumbs-current');
    await expect(current).toBeVisible();
    await expect(current).toHaveAttribute('aria-current', 'page');
  });

  test('home icon navigates back to /', async ({ page }) => {
    await page.goto('/delivery');
    await page.locator('.breadcrumbs').getByLabel('Home').click();
    await expect(page).toHaveURL('/');
  });
});

test.describe('Mobile menu', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test('opens on hamburger click and shows nav links', async ({ page }) => {
    await page.goto('/');
    await page.getByLabel('Open menu').click();

    const menu = page.locator('.mobile-menu');
    await expect(menu).toBeVisible();

    await expect(menu.locator('.nav-link', { hasText: 'Promotions' })).toBeVisible();
    await expect(menu.locator('.nav-link', { hasText: 'Delivery and payments' })).toBeVisible();
    await expect(menu.locator('.nav-link', { hasText: 'Contact' })).toBeVisible();
  });

  test('closes on close button click', async ({ page }) => {
    await page.goto('/');
    await page.getByLabel('Open menu').click();
    await expect(page.locator('.mobile-menu')).toBeVisible();

    await page.locator('.mobile-menu-close-btn').click();
    await expect(page.locator('.mobile-menu')).not.toBeVisible();
  });

  test('navigates to page and closes menu', async ({ page }) => {
    await page.goto('/');
    await page.getByLabel('Open menu').click();

    await page.locator('.mobile-menu .nav-link', { hasText: 'Contact' }).click();

    await expect(page).toHaveURL('/contact');
    await expect(page.getByRole('heading', { name: 'Contact Us' })).toBeVisible();
  });

  test('shows Login and Sign Up when not authenticated', async ({ page }) => {
    await page.goto('/');
    await page.getByLabel('Open menu').click();

    const menu = page.locator('.mobile-menu');
    await expect(menu.getByRole('button', { name: 'Log In' })).toBeVisible();
    await expect(menu.getByRole('button', { name: 'Sign Up' })).toBeVisible();
  });
});

test.describe('404 page', () => {
  test('shows 404 for non-existent URL', async ({ page }) => {
    await page.goto('/this-page-does-not-exist');

    await expect(page.getByRole('heading', { name: '404' })).toBeVisible();
    await expect(page.getByText('Oops! Page not found')).toBeVisible();
    await expect(page.getByText('The page you are looking for')).toBeVisible();
  });

  test('has a "Back to Home" link that works', async ({ page }) => {
    await page.goto('/some-random-path');

    const homeLink = page.getByRole('link', { name: 'Back to Home' });
    await expect(homeLink).toBeVisible();
    await homeLink.click();

    await expect(page).toHaveURL('/');
  });
});
