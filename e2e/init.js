const { detox, device, expect, element, by, waitFor } = require("detox");
const config = require("../package.json").detox;

beforeAll(async () => {
  await detox.installWorker(); // Critical fix
  await detox.init(config);
  await device.launchApp({
    newInstance: true,
    permissions: { notifications: "YES" },
  });
}, 300000); // 5-minute timeout

afterAll(async () => {
  await detox.cleanup();
});
