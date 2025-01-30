const { detox, device, expect, element, by, waitFor } = require("detox");
const config = require("../package.json").detox;

beforeAll(async () => {
  await detox.init(config, { launchApp: false });
  await device.launchApp({
    newInstance: true,
    permissions: { notifications: "YES" },
  });
}, 300000); // 5 minute timeout

beforeEach(async () => {
  await device.reloadReactNative();
});

afterAll(async () => {
  await detox.cleanup();
});
