import { expect, Locator, Page } from "@playwright/test";

export class LoginPage {
  wrongUsernamedMessage = 'Your username is invalid!';
  wrongPasswordMessage = 'Your password is invalid!';

  #usernameInput: Locator;
  #passwordInput: Locator;
  #submitBtn: Locator;
  #errorDiv: Locator;

  constructor(private page: Page) {
    this.#usernameInput = page.locator('#username');
    this.#passwordInput = page.locator('#password');
    this.#submitBtn = page.locator('#submit');
    this.#errorDiv = page.locator('#error');
  }

  async enterLoginData(userName: string, password: string) {
    await this.#usernameInput.fill(userName);
    await this.#passwordInput.fill(password);

    await expect(this.#usernameInput).not.toBeEmpty();
    await expect(this.#passwordInput).not.toBeEmpty();
  }

  async clickSubmitBtn() {
    await this.#submitBtn.click();
  }

  async verifyErrorMessage(message: string) {
    await expect(this.#errorDiv).toHaveText(message);
  }
}