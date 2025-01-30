const { detox } = require("detox");
const config = require("../package.json").detox;

beforeAll(async () => {
  await detox.init(config);
});

afterAll(async () => {
  await detox.cleanup();
});
