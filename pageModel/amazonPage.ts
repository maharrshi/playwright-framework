import { Page, expect } from "@playwright/test";

export class AmazonPage {
  private page: Page;
  private cartPage: Page | null;
  private wishListPage: Page | null;

  constructor(page: Page) {
    this.page = page;
    this.cartPage = null;
    this.wishListPage = null;
  }

  async goToHomePage() {
    await this.page.goto("https://www.amazon.in");
  }

  async isLoginButtonPresent() {
    const loginButton = await this.page.$("#nav-link-accountList");
    return loginButton !== null;
  }

  async searchProduct(productName: string) {
    await this.page.fill("#twotabsearchtextbox", productName);
    await this.page.keyboard.press("Enter");
    await this.page.waitForSelector(
      '//div[@data-cy="title-recipe"]//span[text()="Alchemist"]'
    );
  }

  async addProductToCart() {
    const bookTitle =
      '//div[@data-cy="title-recipe"]//span[text()="Alchemist"]';
    const product = await this.page.$(bookTitle);
    if (product) {
      await product.click();
      const [cartPage] = await Promise.all([
        await this.page.waitForEvent("popup"),
      ]);
      this.cartPage = cartPage;
      await this.cartPage.waitForSelector("#add-to-cart-button");
      await this.cartPage.click("#add-to-cart-button");
      console.log("Product added to cart successfully.");
    } else {
      console.error("No product found to add to cart.");
    }
  }

  async proceedToCheckoutPresent() {
    if (this.cartPage) {
      await this.cartPage.waitForSelector("#sc-buy-box-ptc-button");
      await expect(
        this.cartPage.locator("#sc-buy-box-ptc-button")
      ).toBeVisible();
    } else {
      console.error(
        "Cart page is not available. Please add a product to the cart first."
      );
    }
  }

  async searchResultsCount() {
    const searchResults = await this.page.$$(
      'div[data-component-type="s-search-result"]'
    );
    return searchResults.length;
  }

  async isWishListButtonPresent() {
    const bookTitle =
      '//div[@data-cy="title-recipe"]//span[text()="Alchemist"]';
    const product = await this.page.$(bookTitle);
    if (product) {
      await product.click();
      const [wishListPage] = await Promise.all([
        await this.page.waitForEvent("popup"),
      ]);
      this.wishListPage = wishListPage;

      await this.wishListPage.waitForTimeout(3000);
      await expect(
        this.wishListPage.locator('//a[contains(text(),"Add to Wish List")]')
      ).toBeVisible();
    } else {
      console.error("Unable to find Wishlist on the page");
    }
  }
}
