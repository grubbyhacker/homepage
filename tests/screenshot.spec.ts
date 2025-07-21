import { test, expect } from '@playwright/test';

test.describe('Visual Regression Tests', () => {

  // Test for the entire homepage
  test('homepage visual integrity', async ({ page }) => {
    await page.goto('/homepage/');

    // Wait for the page to be fully loaded and stable
    await page.waitForLoadState('networkidle');

    await page.waitForFunction(() => {
      // Find the specific userbox element by its text content and class
      const userboxes = document.querySelectorAll('div.userbox.selectable a');
      let targetElement = null;
      for (const box of userboxes) {
        if (box.textContent && box.textContent.includes('Roger Fleig')) {
          targetElement = box;
          break;
        }
      }

      if (!targetElement) {
        console.log('Roger Fleig userbox not found yet'); // For debugging within waitForFunction
        return false;
      }

      const fontWeight = window.getComputedStyle(targetElement).fontWeight;
      console.log(`Roger Fleig userbox font-weight: ${fontWeight}`); // For debugging within waitForFunction

      return fontWeight === 'bold' || parseInt(fontWeight, 10) >= 300;
    }, { timeout: 10000 });

    // Take a full page screenshot and compare it to the golden image.
    // The first argument is the name of the snapshot file (e.g., 'homepage-full.png')
    // The `mask` option tells Playwright to ignore changes within the specified locator.
    await expect(page).toHaveScreenshot('homepage-full.png', {
      fullPage: true, // Take a screenshot of the entire scrollable page
      maxDiffPixelRatio: 0.01, // Allow up to 1% pixel difference (adjust as needed)
      // You can also add a threshold here that overrides the one in playwright.config.ts
    });
  });

  // Test for a user profile page
  test('roger profile page visual integrity', async ({ page }) => {
    await page.goto('/homepage/roger/');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveTitle(/Rogers/i);

    await page.waitForTimeout(2000); //TODO: this is flaky

    // Mask the dynamic quote box if it also appears on user pages
    const quoteBox = page.locator('#random-quote-display.quote-container');
    const maskLocators = [];
    if (await quoteBox.isVisible()) { // Check if it's actually visible on this page
      maskLocators.push(quoteBox);
    }
    const profileContent = page.locator('div.userboxes');
    await expect(profileContent).toHaveScreenshot('roger-profile-page.png', {
      mask: maskLocators,
      maxDiffPixelRatio: 0.01,
    });
  });
});
