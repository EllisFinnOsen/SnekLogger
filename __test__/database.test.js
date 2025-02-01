// database.test.js

// --- Set up the mock for expo-sqlite --- //
// We create a factory that does not reference any out-of-scope variable.
// Instead, it holds its own variable (currentFakeDb) and provides a setter.
jest.mock("expo-sqlite", () => {
  let currentFakeDb = null;
  return {
    setFakeDb: (db) => {
      currentFakeDb = db;
    },
    openDatabaseAsync: jest.fn(() => Promise.resolve(currentFakeDb)),
  };
});

// A helper function to normalize SQL strings (removing extra whitespace)
const normalizeSQL = (sql) => sql.replace(/\s+/g, " ").trim();

describe("database.js", () => {
  let fakeDb;
  let database; // This will hold our module under test.
  let SQLite; // This will hold our mocked expo-sqlite module.

  // Reset modules and set up a new fake database before each test.
  beforeEach(async () => {
    // Clear the module cache so that our module-scoped variable in database.js is reinitialized.
    jest.resetModules();

    // Create a fake database object with the methods used in database.js.
    fakeDb = {
      execAsync: jest.fn().mockResolvedValue("execResult"),
      runAsync: jest.fn().mockResolvedValue({ insertId: 42 }),
      getAllAsync: jest.fn().mockResolvedValue([]),
      getFirstAsync: jest.fn().mockResolvedValue(null),
    };

    // Get the mocked expo-sqlite module and update its fake DB.
    SQLite = require("expo-sqlite");
    SQLite.setFakeDb(fakeDb);

    // Now re-import the database module. It will use our mocked expo-sqlite.
    database = require("@/database"); // Adjust the import path as needed.
  });

  describe("openDatabase", () => {
    it("opens the database if not already opened", async () => {
      const db1 = await database.openDatabase();
      expect(SQLite.openDatabaseAsync).toHaveBeenCalledWith("mockData_1.db");
      expect(db1).toBe(fakeDb);
    });

    it("returns the same database instance on multiple calls", async () => {
      const db1 = await database.openDatabase();
      const db2 = await database.openDatabase();
      // openDatabaseAsync should be called only once.
      expect(SQLite.openDatabaseAsync).toHaveBeenCalledTimes(1);
      expect(db1).toBe(db2);
    });
  });

  describe("initializeDatabase", () => {
    it("executes the SQL commands to create tables", async () => {
      await database.initializeDatabase();
      // We expect execAsync to have been called once with a SQL string that contains key parts.
      expect(fakeDb.execAsync).toHaveBeenCalled();
      const sql = fakeDb.execAsync.mock.calls[0][0];
      expect(sql).toMatch(/PRAGMA journal_mode = WAL/);
      expect(sql).toMatch(/CREATE TABLE IF NOT EXISTS pets/);
      expect(sql).toMatch(/CREATE TABLE IF NOT EXISTS groups/);
      expect(sql).toMatch(/CREATE TABLE IF NOT EXISTS group_pets/);
      expect(sql).toMatch(/CREATE TABLE IF NOT EXISTS feedings/);
    });
  });

  describe("insertMockData", () => {
    it("executes SQL statements to insert mock data", async () => {
      await database.insertMockData();
      // In the code, four separate execAsync calls are made:
      // one for pets, one for groups, one for group_pets, and one for feedings.
      expect(fakeDb.execAsync).toHaveBeenCalledTimes(4);
    });
  });

  describe("fetchPetsFromDb", () => {
    it("fetches all pets", async () => {
      const mockPets = [{ id: 1, name: "Fluffy" }];
      fakeDb.getAllAsync.mockResolvedValue(mockPets);
      const pets = await database.fetchPetsFromDb();
      expect(fakeDb.getAllAsync).toHaveBeenCalledWith("SELECT * FROM pets");
      expect(pets).toEqual(mockPets);
    });
  });

  describe("fetchFeedingsByPetFromDb", () => {
    it("fetches feedings by petId", async () => {
      const mockFeedings = [{ id: 10, petId: 3 }];
      fakeDb.getAllAsync.mockResolvedValue(mockFeedings);
      const feedings = await database.fetchFeedingsByPetFromDb(3);
      expect(fakeDb.getAllAsync).toHaveBeenCalledWith(
        "SELECT * FROM feedings WHERE petId = ?",
        [3]
      );
      expect(feedings).toEqual(mockFeedings);
    });
  });

  describe("fetchFeedingByIdFromDb", () => {
    it("fetches a single feeding by id", async () => {
      const mockFeeding = { id: 20, petId: 3 };
      fakeDb.getFirstAsync.mockResolvedValue(mockFeeding);
      const feeding = await database.fetchFeedingByIdFromDb(20);
      expect(fakeDb.getFirstAsync).toHaveBeenCalledWith(
        "SELECT * FROM feedings WHERE id = ?",
        [20]
      );
      expect(feeding).toEqual(mockFeeding);
    });

    it("returns null if no feeding is found", async () => {
      fakeDb.getFirstAsync.mockResolvedValue(null);
      const feeding = await database.fetchFeedingByIdFromDb(999);
      expect(feeding).toBeNull();
    });
  });

  describe("updateFeedingInDb", () => {
    it("updates a feeding and returns the result", async () => {
      const updateResult = { affectedRows: 1 };
      fakeDb.runAsync.mockResolvedValue(updateResult);
      const result = await database.updateFeedingInDb(
        5,
        2,
        "2025-01-01",
        "10:00",
        1
      );
      expect(fakeDb.runAsync).toHaveBeenCalledWith(
        "UPDATE feedings SET petId = ?, feedingDate = ?, feedingTime = ?, complete = ? WHERE id = ?",
        [2, "2025-01-01", "10:00", 1, 5]
      );
      expect(result).toEqual(updateResult);
    });
  });

  describe("getGroupsFromDb", () => {
    it("fetches all groups", async () => {
      const mockGroups = [{ id: 1, name: "Group1" }];
      fakeDb.getAllAsync.mockResolvedValue(mockGroups);
      const groups = await database.getGroupsFromDb();
      expect(fakeDb.getAllAsync).toHaveBeenCalledWith("SELECT * FROM groups");
      expect(groups).toEqual(mockGroups);
    });
  });

  describe("fetchPetsByGroupIdFromDb", () => {
    it("fetches pets for a given group", async () => {
      const mockPets = [{ id: 1, name: "Fluffy" }];
      fakeDb.getAllAsync.mockResolvedValue(mockPets);
      const pets = await database.fetchPetsByGroupIdFromDb(2);
      // Instead of comparing the SQL string directly (which may differ in whitespace),
      // we extract the SQL string from the call and compare normalized strings.
      expect(fakeDb.getAllAsync).toHaveBeenCalled();
      const [sql, params] = fakeDb.getAllAsync.mock.calls[0];
      const expectedSQL = `SELECT pets.* FROM pets
         INNER JOIN group_pets ON pets.id = group_pets.petId
         WHERE group_pets.groupId = ?`;
      expect(normalizeSQL(sql)).toBe(normalizeSQL(expectedSQL));
      expect(params).toEqual([2]);
      expect(pets).toEqual(mockPets);
    });

    it("returns an empty array if the result is not an array", async () => {
      fakeDb.getAllAsync.mockResolvedValue(null);
      const pets = await database.fetchPetsByGroupIdFromDb(2);
      expect(pets).toEqual([]);
    });
  });

  describe("addPetToDb", () => {
    it("inserts a pet and returns its insertId", async () => {
      const newInsertId = 101;
      fakeDb.runAsync.mockResolvedValue({ insertId: newInsertId });
      const newPet = {
        name: "Buddy",
        species: "Dog",
        morph: "Golden Retriever",
        birthDate: "2020-01-01",
        weight: 30,
        imageURL: "https://example.com/buddy.jpg",
      };
      const insertId = await database.addPetToDb(newPet);
      expect(fakeDb.runAsync).toHaveBeenCalled();
      const [sql, params] = fakeDb.runAsync.mock.calls[0];
      const expectedSQL = `INSERT INTO pets (name, species, morph, birthDate, weight, imageURL)
         VALUES (?, ?, ?, ?, ?, ?)`;
      expect(normalizeSQL(sql)).toBe(normalizeSQL(expectedSQL));
      expect(params).toEqual([
        newPet.name,
        newPet.species,
        newPet.morph,
        newPet.birthDate,
        newPet.weight,
        newPet.imageURL,
      ]);
      expect(insertId).toBe(newInsertId);
    });
  });
});
