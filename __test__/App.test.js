const fs = require("fs");

test("Ensure resetDatabase and insertMockData are commented out in App.js", () => {
  const appFilePath = "./src/App.js"; // Adjust path if necessary
  const appCode = fs.readFileSync(appFilePath, "utf8");

  // Ensure resetDatabase() and insertMockData() are NOT active (i.e., commented out)
  const resetDatabaseActive =
    /\bawait resetDatabase\(\);/.test(appCode) &&
    !/\/\/\s*await resetDatabase\(\);/.test(appCode);
  const insertMockDataActive =
    /\bawait insertMockData\(\);/.test(appCode) &&
    !/\/\/\s*await insertMockData\(\);/.test(appCode);

  const insertOnePet =
    /\bawait insertMockData\(\);/.test(appCode) &&
    !/\/\/\s*await insertMockData\(\);/.test(appCode);

  expect(resetDatabaseActive).toBe(false);
  expect(insertMockDataActive).toBe(false);
  expect(insertOnePet).toBe(false);
});
