import { test, expect } from '@playwright/test';

test.describe('Nexus Virtual Community Space E2E Flow', () => {
  test('Complete user journey walkthrough', async ({ page }) => {
    // 1. Visit Home Landing Page
    await page.goto('http://localhost:3000/');
    await expect(page.locator('h1.hero-title')).toContainText('Nexus Innovation & Tech Hub');

    // Wait for location cards to load
    const cards = page.locator('.location-card');
    await expect(cards).toHaveCount(4);

    await page.screenshot({ path: 'assets/frame_01_home.png' });

    // 2. Click on the first location ("Main Stage Auditorium")
    await cards.first().click();
    await expect(page).toHaveURL(/\/locations\/1/);
    await expect(page.locator('.location-detail-title')).toContainText('Main Stage Auditorium');

    await page.screenshot({ path: 'assets/frame_02_location_detail.png' });

    // 3. Navigate to All Events Page
    await page.click('text=All Events');
    await expect(page).toHaveURL(/\/events/);
    await expect(page.locator('.page-header h1')).toContainText('All Community Events');

    await page.screenshot({ path: 'assets/frame_03_all_events.png' });

    // 4. Test Filtering & Sorting
    await page.selectOption('#category-filter', 'Workshop');
    const filteredEvents = page.locator('.event-card');
    await expect(filteredEvents).toHaveCount(3);

    await page.screenshot({ path: 'assets/frame_04_filtered_events.png' });

    // Reset filter
    await page.selectOption('#category-filter', 'All');

    // Test Live Countdown & Past Event Styling presence
    const countdown = page.locator('.countdown-badge').first();
    await expect(countdown).toBeVisible();

    const pastBadge = page.locator('.past-overlay-badge').first();
    await expect(pastBadge).toBeVisible();

    await page.screenshot({ path: 'assets/frame_05_countdowns_past.png' });
  });
});
