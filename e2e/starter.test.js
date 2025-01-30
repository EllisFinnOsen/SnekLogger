describe("Example Detox Test", () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  it("should show the welcome screen", async () => {
    await expect(element(by.id("welcomeText"))).toBeVisible();
  });
});
