const { detox, device } = require("detox");
const config = require("../package.json").detox;

beforeAll(async () => {
  await detox.installWorker(); // Critical step to avoid DetoxSecondaryContext errors
  await detox.init(config, { launchApp: false });

  await device.launchApp({
    newInstance: true,
    permissions: { notifications: "YES" },
  });
}, 300000);

afterAll(async () => {
  await detox.cleanup();
});
