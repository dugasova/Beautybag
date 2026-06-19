import { test, expect } from '@playwright/test';

const fillAndSubmitLogin = async (page: import('@playwright/test').Page, email: string, password: string) => {
  await page.locator('#email').fill(email);
  await page.locator('#password').fill(password);
  await page.locator('.base-form button[type="submit"]').click();
};

test.describe('AuthGuard — protected routes redirect to /login', () => {
  const protectedRoutes = ['/cart', '/checkout', '/account', '/wishlist'];

  for (const route of protectedRoutes) {
    test(`${route} redirects to /login when not authenticated`, async ({ page }) => {
      await page.goto(route);
      await expect(page).toHaveURL('/login');
    });
  }
});

test.describe('Login form validation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('submit button is disabled with empty fields', async ({ page }) => {
    const submitBtn = page.locator('.base-form button[type="submit"]');
    await expect(submitBtn).toBeDisabled();
  });

  test('shows error for invalid email', async ({ page }) => {
    await page.locator('#email').fill('not-an-email');
    await page.locator('#password').fill('123456');

    await expect(page.locator('#email-error')).toBeVisible();
  });

  test('shows error for short password', async ({ page }) => {
    await page.locator('#email').fill('user@example.com');
    await page.locator('#password').fill('123');

    await expect(page.locator('#password-error')).toBeVisible();
  });

  test('shows error for too long password', async ({ page }) => {
    await page.locator('#email').fill('user@example.com');
    await page.locator('#password').fill('1234567890123');

    await expect(page.locator('#password-error')).toBeVisible();
  });

  test('enables submit button with valid inputs', async ({ page }) => {
    await page.locator('#email').fill('user@example.com');
    await page.locator('#password').fill('123456');

    const submitBtn = page.locator('.base-form button[type="submit"]');
    await expect(submitBtn).toBeEnabled();
  });
});

test.describe('Login with invalid credentials', () => {
  test('shows error message for wrong password', async ({ page }) => {
    await page.goto('/login');

    await fillAndSubmitLogin(page, 'wrong@example.com', 'wrongpass');

    await expect(page.locator('.error-message')).toHaveText('Invalid email or password', { timeout: 10000 });
  });
});

test.describe('Register → Login → Logout full flow', () => {
  const uniqueEmail = `test_${Date.now()}@e2etest.com`;
  const password = 'Test123456';

  test.describe.configure({ mode: 'serial' });

  test('registers a new user and redirects to home', async ({ page }) => {
    await page.goto('/register');
    await expect(page.getByRole('heading', { name: 'Sign Up' })).toBeVisible();

    await page.locator('#email').fill(uniqueEmail);
    await page.locator('#password').fill(password);
    await page.locator('.base-form button[type="submit"]').click();

    await expect(page.getByText('Successfully registered!')).toBeVisible({ timeout: 15000 });
    await expect(page).toHaveURL('/', { timeout: 10000 });
  });

  test('logs in with the registered account', async ({ page }) => {
    await page.goto('/login');
    await fillAndSubmitLogin(page, uniqueEmail, password);

    await expect(page.getByText('Successfully logged in!')).toBeVisible({ timeout: 15000 });
    await expect(page).toHaveURL('/', { timeout: 10000 });
  });

  test('logout clears auth state and shows login/signup buttons', async ({ page }) => {
    await page.goto('/login');
    await fillAndSubmitLogin(page, uniqueEmail, password);
    await expect(page).toHaveURL('/', { timeout: 15000 });

    await expect(page.locator('.actions').getByRole('button', { name: 'Account' })).toBeVisible({ timeout: 5000 });

    await page.locator('.actions').getByRole('button', { name: 'Logout' }).click();

    await expect(page.locator('.actions').getByRole('button', { name: 'Log In' })).toBeVisible({ timeout: 5000 });
    await expect(page.locator('.actions').getByRole('button', { name: 'Sign Up' })).toBeVisible();
  });

  test('after logout, protected route redirects to /login again', async ({ page }) => {
    await page.goto('/login');
    await fillAndSubmitLogin(page, uniqueEmail, password);
    await expect(page).toHaveURL('/', { timeout: 15000 });

    await page.locator('.actions').getByRole('button', { name: 'Logout' }).click();
    await expect(page.locator('.actions').getByRole('button', { name: 'Log In' })).toBeVisible({ timeout: 5000 });

    await page.goto('/cart');
    await expect(page).toHaveURL('/login');
  });
});

test.describe('Redirect back after login (prevPath)', () => {
  const email = `test_redirect_${Date.now()}@e2etest.com`;
  const password = 'Test123456';

  test.describe.configure({ mode: 'serial' });

  test('register test user', async ({ page }) => {
    await page.goto('/register');
    await page.locator('#email').fill(email);
    await page.locator('#password').fill(password);
    await page.locator('.base-form button[type="submit"]').click();
    await expect(page).toHaveURL('/', { timeout: 15000 });
  });

  test('redirects to protected page after login', async ({ page }) => {
    await page.goto('/cart');
    await expect(page).toHaveURL('/login');

    await fillAndSubmitLogin(page, email, password);

    await expect(page).toHaveURL('/cart', { timeout: 15000 });
  });
});

test.describe('Navigation links between login and register', () => {
  test('login page has link to register', async ({ page }) => {
    await page.goto('/login');
    await page.locator('.login-link').click();
    await expect(page).toHaveURL('/register');
  });

  test('register page has link to login', async ({ page }) => {
    await page.goto('/register');
    await page.locator('.register-link').click();
    await expect(page).toHaveURL('/login');
  });
});
