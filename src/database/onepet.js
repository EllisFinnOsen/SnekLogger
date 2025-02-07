import { openDatabase } from "./index.js";

export const insertOnePet = async () => {
  try {
    const db = await openDatabase();

    // Insert sample pets
    await db.runAsync(
      `INSERT INTO pets (name, category, species, morph, birthDate, weight, weightType, imageURL)
       VALUES
        ('Charlie', 'Snakes', 'Corn Snake', 'Normal', '2020-06-15', 1.2, 'g', 'https://www.awsfzoo.com/media/Corn-Snake-Website-906x580.jpg'),
        ('Max', 'Lizards', 'Leopard Gecko', 'Normal', '2019-04-10', 0.09, 'g', NULL),
        ('Alby', 'Snakes', 'Ball Python', 'Albino', '2022-01-01', 2.5, 'g', 'https://www.worldofballpythons.com/files/morphs/albino/014.jpg')
      `
    );

    // Insert sample groups
    await db.runAsync(
      `INSERT INTO groups (name, notes)
       VALUES
        ('Upstairs Room', 'Pets kept in the upstairs reptile room.'),
        ('Lizards', 'All lizards including geckos and bearded dragons.')
      `
    );

    // Map pets to groups
    await db.runAsync(
      `INSERT INTO group_pets (groupId, petId) 
       VALUES 
        (1, 1), (1, 2), (2, 3)
      `
    );

    // Insert sample feedings
    await db.runAsync(
      `INSERT INTO feedings (petId, feedingDate, feedingTime, preyType, preyWeight, preyWeightType, notes, complete)
       VALUES
        (3, '2025-01-10', '09:00:00', 'Dog', 2.0, 'g', 'Weekly feeding', 0),
        (2, '2025-02-02', '09:00:00', 'Pig', 2.0, 'g', 'Weekly feeding', 1)
      `
    );

    // Insert user profile
    await db.runAsync(
      `INSERT INTO users (id, name, photo, birthdate)
       VALUES (1, 'Ellis', 'https://avatars.githubusercontent.com/u/15618526?v=4', '1990-05-11')
       ON CONFLICT(id) DO UPDATE SET 
         name = excluded.name,
         photo = excluded.photo,
         birthdate = excluded.birthdate
      `
    );

    //console.log("Mock data inserted successfully.");
  } catch (error) {
    //console.error("Error inserting mock data:", error);
  }
};
