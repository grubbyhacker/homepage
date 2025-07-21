import { test, expect } from '@playwright/test';

async function verifyTopNavBarLinksVisible(page: Page) {
  // Select all anchor tags (links) directly within the specified nav bar
  const navLinks = page.locator('body > div > div.header > nav a');
  // Get the count of links found
  const count = await navLinks.count();
  // Assert that at least one link is found (optional, but good for sanity)
  await expect(count).toBeGreaterThan(0);

  // Iterate through each link and assert its visibility
  for (let i = 0; i < count; ++i) {
    await expect(navLinks.nth(i)).toBeVisible();
  }
}

test('homepage has correct title', async ({ page }) => {
  await page.goto('/homepage/');
  await expect(page).toHaveTitle(/Fleig Family Website/i);
});

test('homepage has navbar', async ({ page }) => {
  await page.goto('/homepage/');
  await expect(page).toHaveTitle(/Fleig Family Website/i);
  await verifyTopNavBarLinksVisible(page);
});

test('homepage has at least two selectable userboxes', async ({ page }) => {
  await page.goto('/homepage/');
  // Select all div elements with classes 'userbox' and 'selectable'
  const userboxes = page.locator('div.userbox.selectable');
  // Get the count of userboxes found
  const count = await userboxes.count();
  // Assert that at least two such userboxes are found
  await expect(count).toBeGreaterThanOrEqual(2);
  // Optionally, verify that each of these found userboxes is visible
  for (let i = 0; i < count; ++i) {
    await expect(userboxes.nth(i)).toBeVisible();
  }
});

test('Disclaimer page loads and has specific content', async ({ page }) => {
  await page.goto('/homepage/disclaimer/');
  await expect(page).toHaveTitle(/Disclaimer/i);
  await expect(page.locator('h1')).toHaveText('Disclaimer');
  await expect(page.locator('body')).toContainText('Please use your own judgment and discretion');
  await verifyTopNavBarLinksVisible(page);
});

test('footer is present and visible on homepage', async ({ page }) => {
  await page.goto('/homepage/');
  const footer = page.locator('div.footer.centered-element');
  await expect(footer).toBeVisible();
  await expect(footer).toContainText('Fleig Family Website');
  await expect(footer).toContainText('Disclaimer');
  await expect(footer).toContainText('Powered by Hugo');
});

test('clicking userbox navigates to correct profile page', async ({ page }) => {
  await page.goto('/homepage/');
  const rogerUserbox = page.locator('div.userbox.selectable a', { hasText: /Roger Fleig/i });
  await expect(rogerUserbox).toBeVisible();
  await rogerUserbox.click();
  await page.waitForLoadState('networkidle'); 
  await page.waitForURL(/.*\/homepage\/roger/i);
  await expect(page).toHaveTitle(/Rogers/i);
});

test('user homepage has at least two nav links under avatar', async ({ page }) => {
  await page.goto('/homepage/roger/');
  // TODO: use a stable id for testable elments like: data-testid="user-profile-nav-links"
  const navLinksUnderAvatar = page.locator('body > div > div.content > div > div.userboxes > div > div.navlinks a');

  // Assert that at least two links are found
  const count = await navLinksUnderAvatar.count();
  await expect(count).toBeGreaterThanOrEqual(2);

  // Verify each of these links is visible
  for (let i = 0; i < count; ++i) {
    await expect(navLinksUnderAvatar.nth(i)).toBeVisible();
  }
});

test('user homepage has about and blog links in top nav', async ({ page }) => {
  // Navigate to a specific user's homepage first
  await page.goto('/homepage/roger/');

  // Check for 'About' link in the top navigation of the user page
  const aboutLink = page.locator('nav a', { hasText: 'About' });
  await expect(aboutLink).toBeVisible();
  await expect(aboutLink).toHaveText('About');

  // Check for 'Blog' link in the top navigation of the user page
  const blogLink = page.locator('nav a', { hasText: 'Blog' });
  await expect(blogLink).toBeVisible();
  await expect(blogLink).toHaveText('Blog');
});

test('homepage has visible quotation box', async ({ page }) => {
  await page.goto('/homepage/roger'); // Navigate to the homepage

  const quoteBox = page.locator('#random-quote-display.quote-container');
  await expect(quoteBox).toBeVisible();
  await expect(quoteBox.locator('.quote-text')).toBeVisible();
  await expect(quoteBox.locator('.quote-author')).toBeVisible();
});

test('navigate from user homepage to user blog and verify content', async ({ page }) => {
  await page.goto('/homepage/roger/');

  // Click on the Blog button (in the top navigation)
  const blogButton = page.locator('nav a', { hasText: 'Blog' });
  await expect(blogButton).toBeVisible();
  await blogButton.click();

  // Wait for /homepage/roger/blog/ to open
  await page.waitForURL(/.*\/homepage\/roger\/blog\//);

  // Verify that the resulting page has a footer
  const footer = page.locator('div.footer.centered-element');
  await expect(footer).toBeVisible();
  await expect(footer).toContainText('Fleig Family Website'); // Re-checking content for robustness

  // Verify that it has an about and blog link at the top still
  const aboutLink = page.locator('nav a', { hasText: 'About' });
  await expect(aboutLink).toBeVisible();
  await expect(aboutLink).toHaveText('About');

  const blogLink = page.locator('nav a', { hasText: 'Blog' });
  await expect(blogLink).toBeVisible();
  await expect(blogLink).toHaveText('Blog');

  // Verify that there is a list item with a date in October at body > div > div.content > div > ul > li
  // Using hasText to make the selector more robust by looking for "October" within the list item.
  const octoberListItem = page.locator('body > div > div.content > div > ul > li', { hasText: /October/i });
  await expect(octoberListItem).toBeVisible();
});
