import { test, expect } from '@playwright/test';

test.describe('Contact page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/contact');
  });

  test('renders page title and subtitle', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Contact Us' })).toBeVisible();
    await expect(page.getByText('We would love to hear from you')).toBeVisible();
  });

  test('displays contact info: boutique, support, social links', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Our Boutique' })).toBeVisible();
    await expect(page.getByText('123 Beauty Lane')).toBeVisible();

    await expect(page.getByRole('heading', { name: 'Customer Support' })).toBeVisible();
    await expect(page.getByText('+380 (44) 123-45-67')).toBeVisible();
    await expect(page.getByText('support@beautybag.com')).toBeVisible();

    await expect(page.getByRole('heading', { name: 'Follow Us' })).toBeVisible();
    await expect(page.getByLabel('Instagram')).toBeVisible();
    await expect(page.getByLabel('Facebook')).toBeVisible();
    await expect(page.getByLabel('Pinterest')).toBeVisible();
  });

  test('shows validation errors on empty form submit', async ({ page }) => {
    await page.getByRole('button', { name: 'Send Message' }).click();

    await expect(page.getByRole('alert')).toHaveCount(3);
  });

  test('shows validation error for short message', async ({ page }) => {
    await page.getByLabel('Full Name').fill('Anna');
    await page.getByLabel('Email Address').fill('anna@test.com');
    await page.getByLabel('Message').fill('Hi');

    await page.getByRole('button', { name: 'Send Message' }).click();

    const alerts = page.getByRole('alert');
    await expect(alerts).toHaveCount(1);
  });

  test('submits valid form and shows success toast', async ({ page }) => {
    await page.getByLabel('Full Name').fill('Anna Smith');
    await page.getByLabel('Email Address').fill('anna@example.com');
    await page.getByLabel('Subject').fill('Question');
    await page.getByLabel('Message').fill('Hello, I have a question about delivery options.');

    await page.getByRole('button', { name: 'Send Message' }).click();

    await expect(page.getByText('Your message has been sent successfully!')).toBeVisible({ timeout: 5000 });
  });

  test('clears form after successful submit', async ({ page }) => {
    await page.getByLabel('Full Name').fill('Anna Smith');
    await page.getByLabel('Email Address').fill('anna@example.com');
    await page.getByLabel('Message').fill('Hello, this is a test message for the form.');

    await page.getByRole('button', { name: 'Send Message' }).click();

    await expect(page.getByText('Your message has been sent successfully!')).toBeVisible({ timeout: 5000 });

    await expect(page.getByLabel('Full Name')).toHaveValue('');
    await expect(page.getByLabel('Email Address')).toHaveValue('');
    await expect(page.getByLabel('Message')).toHaveValue('');
  });

  test('social links open in new tab', async ({ page }) => {
    const instagram = page.getByLabel('Instagram');
    await expect(instagram).toHaveAttribute('target', '_blank');
    await expect(instagram).toHaveAttribute('rel', 'noopener noreferrer');
  });
});
