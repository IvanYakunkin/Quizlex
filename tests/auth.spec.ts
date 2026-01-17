import { test, expect } from '@playwright/test';
import { prisma } from '../lib/prisma';

const randomEmail = `testuser${Date.now()}@example.com`;
const randomLogin = `testuser${Date.now()}`;
const password = 'TestPassword123';

test.describe('Authentication Flow', () => {
    test.afterAll(async () => {
        try {
            await prisma.user.delete({
                where: { email: randomEmail }
            });
        } catch {
            console.log('The user has not been created or has already been deleted.');
        } finally {
            await prisma.$disconnect();
        }
    });
    test("Full user lifecycle: Register -> Logout -> Login", async ({ page }) => {
        await test.step("Register new user", async () => {
            await page.goto('/');
            const loginButton = page.getByTestId("auth-login-button");
            await loginButton.click();

            const dialog = page.getByTestId('auth-dialog');
            await expect(dialog).toBeVisible();

            const loginWithEmailButton = page.getByTestId("login-with-email");
            await loginWithEmailButton.click();

            const signUpButton = dialog.getByTestId("switcher-signup-btn");
            await signUpButton.click();

            await page.fill('input[name="email"]', randomEmail);
            await page.fill('input[name="login"]', randomLogin);
            await page.fill('input[name="password"]', password);
            await page.fill('input[name="passwordConfirm"]', password);

            await page.click('button[type="submit"]');
            const spinner = page.getByTestId("signup-spinner");
            await expect(spinner).not.toBeVisible({ timeout: 10000 });
            await expect(dialog).not.toBeVisible();
            const modulesTitle = page.getByTestId("modules-title");
            await expect(modulesTitle).toBeVisible();
        });
        await test.step("Logout", async () => {
            const logoutButton = page.getByTestId("logout-button");
            await expect(logoutButton).toBeVisible();
            await logoutButton.click();
            const mainPage = page.getByTestId("main-page");
            await expect(mainPage).toBeVisible();
        });
        await test.step("Login", async () => {

            const loginButton = page.getByTestId("auth-login-button");
            await expect(loginButton).toBeVisible();
            await loginButton.click();

            const dialog = page.getByTestId('auth-dialog');
            await expect(dialog).toBeVisible();

            const loginWithEmailButton = page.getByTestId("login-with-email");
            await loginWithEmailButton.click();

            await page.fill('input[name="email"]', randomEmail);
            await page.fill('input[name="password"]', password);
            await page.click('button[type="submit"]');

            const spinner = page.getByTestId("login-spinner");
            await expect(spinner).not.toBeVisible({ timeout: 10000 })

            await expect(dialog).not.toBeVisible();
            const modulesTitle = page.getByTestId("modules-title");
            await expect(modulesTitle).toBeVisible();
        });
    });

    test("Should show error message with invalid credentials", async ({ page }) => {
        await page.goto('/');
        await page.getByTestId("auth-login-button").click();
        await page.getByTestId("login-with-email").click();

        await page.fill('input[name="email"]', 'non-existent@user.com');
        await page.fill('input[name="password"]', 'WrongPassword123');
        await page.click('button[type="submit"]');

        const errorAlert = page.getByTestId("auth-error");
        await expect(errorAlert).toBeVisible();
    });
});