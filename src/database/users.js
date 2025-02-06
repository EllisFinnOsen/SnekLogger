import { openDatabase } from "./index.js";

// File: database.js
export const fetchUserProfileFromDb = async () => {
  try {
    const db = await openDatabase();
    const result = await db.getFirstAsync("SELECT * FROM users");
    return result || { name: "", photo: "", birthdate: "" }; // Default values
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
};

export const updateUserProfileInDb = async (user) => {
  try {
    const db = await openDatabase();
    await db.runAsync(
      `INSERT INTO users (id, name, photo, birthdate)
         VALUES (1, ?, ?, ?)
         ON CONFLICT(id) DO UPDATE SET 
           name = excluded.name,
           photo = excluded.photo,
           birthdate = excluded.birthdate;`,
      [user.name, user.photo, user.birthdate]
    );
  } catch (error) {
    console.error("Error updating user profile in DB:", error);
    throw error;
  }
};
