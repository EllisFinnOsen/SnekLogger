const { device, expect, element, by, waitFor } = require("detox");

describe("Example Detox Test", () => {
  beforeAll(async () => {
    await device.launchApp({ newInstance: true });
  });

  it("should show welcome screen", async () => {
    await waitFor(element(by.id("welcomeText")))
      .toBeVisible()
      .withTimeout(10000);

    await expect(element(by.text("Hello, Ellis"))).toBeVisible();
  });
});
