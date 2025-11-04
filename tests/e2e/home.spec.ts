import { test, expect } from '@playwright/test';

test('Trang chủ hiển thị tiêu đề đúng', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Green/);
  await expect(page.locator('body')).toContainText('Tương lai xanh hơn');
});
