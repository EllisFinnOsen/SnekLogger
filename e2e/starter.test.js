describe("Example Detox Test", () => {
  it("should show welcome screen", async () => {
    // Wait for app to be visible
    await waitFor(element(by.id("welcome-screen")))
      .toBeVisible()
      .withTimeout(10000);

    // Add your specific test assertions
    await expect(element(by.text("Welcome"))).toBeVisible();
  });
});
