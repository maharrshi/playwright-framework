import { test, expect } from "@playwright/test";
import { AmazonPage } from "../pageModel/amazonPage";

test("Amazon Page", async ({ page }) => {
  const amazonPage = new AmazonPage(page);

  try {
    await amazonPage.goToHomePage();

    // Validate Login
    const isLoginButtonPresent = await amazonPage.isLoginButtonPresent();
    expect(isLoginButtonPresent).toBeTruthy();

    // Product Checkout
    await amazonPage.searchProduct("the alchemist by paulo coelho");
    await amazonPage.addProductToCart();

    //Validate Proceed to checkout
    await amazonPage.proceedToCheckoutPresent();

    // Search Functionality
    const searchQuery = "the alchemist by paulo coelho";
    await page.bringToFront();
    await amazonPage.searchProduct(searchQuery);
    const searchResultsCount = await amazonPage.searchResultsCount();
    console.log(`Search results for '${searchQuery}': ${searchResultsCount}`);

    // Validate Wishlist
    await amazonPage.isWishListButtonPresent();
  } catch (error) {
    console.error("Error occurred during test execution:", error);
  }
});
