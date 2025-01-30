const { detox, device } = require("detox");
const config = require("../package.json").detox;

beforeAll(async () => {
  await detox.installWorker(); // Ensure the worker is installed first
  await detox.init(config, { launchApp: false }); // Do not auto-launch
  await device.launchApp({
    newInstance: true,
    permissions: { notifications: "YES" },
  });
}, 300000); // 5-minute timeout

afterAll(async () => {
  await detox.cleanup();
});
