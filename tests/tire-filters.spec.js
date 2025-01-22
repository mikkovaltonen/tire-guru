import { test, expect } from '@playwright/test';

// Test basic filter visibility
test('should load all filter dropdowns', async ({ page }) => {
  await page.goto('/');
  await page.waitForSelector('text=Rengashaku');

  // Verify all filter dropdowns are present
  await expect(page.locator('text=Kausi')).toBeVisible();
  await expect(page.locator('text=Halkaisija')).toBeVisible();
  await expect(page.locator('text=Leveys')).toBeVisible();
  await expect(page.locator('text=Korkeus')).toBeVisible();
});

// Test filter enable/disable logic
test('should enable width and profile selects after season and diameter selection', async ({ page }) => {
  await page.goto('/');
  await page.waitForSelector('text=Rengashaku');

  // Initially, width and profile should be disabled
  await expect(page.locator('text=Leveys').locator('..').locator('select')).toBeDisabled();
  await expect(page.locator('text=Korkeus').locator('..').locator('select')).toBeDisabled();

  // Select season
  await page.selectOption('text=Kausi >> select', { label: 'Kesä' });
  
  // Select diameter
  await page.selectOption('text=Halkaisija >> select', '17');

  // Width and profile should now be enabled
  await expect(page.locator('text=Leveys').locator('..').locator('select')).toBeEnabled();
  await expect(page.locator('text=Korkeus').locator('..').locator('select')).toBeEnabled();
});

// Test complete filter flow
test('should filter products when all filters are selected', async ({ page }) => {
  await page.goto('/');
  await page.waitForSelector('text=Rengashaku');

  // Select season (Kesä)
  await page.selectOption('text=Kausi >> select', { label: 'Kesä' });
  
  // Select diameter (17")
  await page.selectOption('text=Halkaisija >> select', '17');

  // Wait for width options to load
  await page.waitForSelector('text=Leveys >> select:not([disabled])');

  // Get the first available width
  const widthSelect = await page.locator('text=Leveys >> select');
  const widthOptions = await widthSelect.locator('option').all();
  const firstWidth = await widthOptions[1]?.getAttribute('value'); // Skip the first empty option
  if (firstWidth) {
    await widthSelect.selectOption(firstWidth);
  }

  // Wait for profile options to load
  await page.waitForSelector('text=Korkeus >> select:not([disabled])');

  // Get the first available profile
  const profileSelect = await page.locator('text=Korkeus >> select');
  const profileOptions = await profileSelect.locator('option').all();
  const firstProfile = await profileOptions[1]?.getAttribute('value'); // Skip the first empty option
  if (firstProfile) {
    await profileSelect.selectOption(firstProfile);
  }

  // Wait for products to load
  await page.waitForSelector('text=Featured Tire Products');

  // Verify that products are displayed
  const products = await page.locator('.MuiCard-root').count();
  expect(products).toBeGreaterThan(0);

  // Verify product details match selected filters
  if (products > 0) {
    const firstProduct = await page.locator('.MuiCard-root').first();
    const productText = await firstProduct.textContent();
    
    if (firstWidth) expect(productText).toContain(firstWidth);
    if (firstProfile) expect(productText).toContain(firstProfile);
    expect(productText).toContain('17');
  }
});

// Test no results case
test('should show no results message for invalid filter combination', async ({ page }) => {
  await page.goto('/');
  await page.waitForSelector('text=Rengashaku');

  // Select an unlikely combination of filters
  await page.selectOption('text=Kausi >> select', { label: 'Kesä' });
  await page.selectOption('text=Halkaisija >> select', '21'); // Uncommon size

  // Wait for the no results message
  await expect(page.locator('text=No products found with the selected filters')).toBeVisible();
});

// Test filter persistence
test('should persist filter selections', async ({ page }) => {
  await page.goto('/');
  await page.waitForSelector('text=Rengashaku');

  // Make selections
  await page.selectOption('text=Kausi >> select', { label: 'Kesä' });
  await page.selectOption('text=Halkaisija >> select', '17');

  // Reload the page
  await page.reload();

  // Verify selections are maintained
  await expect(page.locator('text=Kausi >> select')).toHaveValue('So');
  await expect(page.locator('text=Halkaisija >> select')).toHaveValue('17');
}); 