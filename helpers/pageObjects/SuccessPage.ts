import { expect, Locator, Page } from "@playwright/test";

export class SuccessPage {
  #pageTitle: Locator;

  #successText: string = 'Logged In Successfully';

  constructor(private page: Page) {
    this.#pageTitle = page.locator('h1.post-title');
  }

  async verifySuccessText() {
    await expect(this.#pageTitle).toHaveText(this.#successText);
  }
}