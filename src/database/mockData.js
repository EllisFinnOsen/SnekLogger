import { openDatabase } from "./index.js";

export const insertRobustMockData = async () => {
  try {
    const db = await openDatabase();

    // --------------------------------------------------
    // 1. Insert sample pets (5 pets)
    // --------------------------------------------------
    await db.runAsync(
      `INSERT INTO pets (name, category, species, morph, birthDate, weight, weightType, imageURL)
       VALUES
         ('Charlie', 'Snakes', 'Corn Snake', 'Normal', '2020-06-15', 1.2, 'kg', 'https://www.awsfzoo.com/media/Corn-Snake-Website-906x580.jpg'),
         ('Max', 'Lizards', 'Leopard Gecko', 'Normal', '2019-04-10', 0.09, 'kg', 'https://www.cbreptile.com/wp-content/smush-webp/2018/04/tangerine-leopard-gecko.jpg.webp')`
    );

    // --------------------------------------------------
    // 2. Insert sample groups (4 groups)
    // --------------------------------------------------
    await db.runAsync(
      `INSERT INTO groups (name, notes)
       VALUES
         ('Upstairs Room', 'Pets kept in the upstairs reptile room.'),
         ('Lizards', 'All lizards including geckos and bearded dragons.'),
         ('Turtles', 'Various types of turtles.'),
         ('Snakes', 'Different snake species.')
      `
    );

    // --------------------------------------------------
    // 3. Map pets to groups
    // --------------------------------------------------
    await db.runAsync(
      `INSERT INTO group_pets (groupId, petId)
       VALUES
         (1, 1),  -- Charlie in Upstairs Room
         (1, 2),  -- Max in Upstairs Room
         (4, 3),  -- Alby in Snakes group
         (2, 4),  -- Buddy in Lizards group
         (3, 5)   -- Luna in Turtles group
      `
    );

    // --------------------------------------------------
    // 4. Insert sample feedings (multiple feedings per pet)
    // --------------------------------------------------
    await db.runAsync(
      `INSERT INTO feedings (petId, feedingTimestamp, preyType, preyWeight, preyWeightType, notes, complete)
       VALUES
         -- Pet 1: Feedings over 6 months (from 2025-02-01 to 2025-07-01)
         (1, '2024-02-08T08:00:00Z', 'Pinky Mouse', 1.75, 'g', 'Feeding 1 - Extra-Small Pinky Mouse', 1),
         (1, '2024-02-22T08:00:00Z', 'Pinky Mouse', 1.85, 'g', 'Feeding 2 - Extra-Small Pinky Mouse', 1),
         (1, '2024-03-07T08:00:00Z', 'Pinky Mouse', 1.95, 'g', 'Feeding 3 - Extra-Small Pinky Mouse', 1),
         (1, '2024-03-21T08:00:00Z', 'Pinky Mouse', 2.00, 'g', 'Feeding 4 - Extra-Small Pinky Mouse', 1),
         (1, '2024-04-04T08:00:00Z', 'Pinky Mouse', 2.14, 'g', 'Feeding 5 - Extra-Small Pinky Mouse', 1),
         (1, '2024-04-18T08:00:00Z', 'Pinky Mouse', 2.25, 'g', 'Feeding 6 - Small Pinky Mouse', 1),
         (1, '2024-05-02T08:00:00Z', 'Pinky Mouse', 2.28, 'g', 'Feeding 7 - Small Pinky Mouse', 1),
         (1, '2024-05-16T08:00:00Z', 'Pinky Mouse', 2.3, 'g', 'Feeding 8 - Small Pinky Mouse', 1),
         (1, '2024-05-30T08:00:00Z', 'Pinky Mouse', 2.4, 'g', 'Feeding 9 - Small Pinky Mouse', 1),
         (1, '2024-06-13T08:00:00Z', 'Pinky Mouse', 2.5, 'g', 'Feeding 10 - Small Pinky Mouse', 1),
         (1, '2024-06-27T08:00:00Z', 'Pinky Mouse', 2.25, 'g', 'Feeding 11 - Small Pinky Mouse', 1),
         (1, '2024-07-11T08:00:00Z', 'Pinky Mouse', 2.75, 'g', 'Feeding 12 - Large Pinky Mouse', 1),
         (1, '2024-07-25T08:00:00Z', 'Pinky Mouse', 2.9, 'g', 'Feeding 13 - Large Pinky Mouse', 1),
         (1, '2024-08-08T08:00:00Z', 'Pinky Mouse', 2.95, 'g', 'Feeding 14 - Large Pinky Mouse', 1),
         (1, '2024-08-22T08:00:00Z', 'Pinky Mouse', 2.9, 'g', 'Feeding 15 - Large Pinky Mouse', 1),
         (1, '2024-09-05T08:00:00Z', 'Pinky Mouse', 2.95, 'g', 'Feeding 16 - Large Pinky Mouse', 1),
         (1, '2024-09-19T08:00:00Z', 'Pinky Mouse', 3.00, 'g', 'Feeding 17 - Large Pinky Mouse', 1),
         (1, '2024-10-03T08:00:00Z', 'Fuzzy Mouse', 3.15, 'g', 'Feeding 18 - Peach Fuzzy Mouse', 1),
         (1, '2024-10-17T08:00:00Z', 'Fuzzy Mouse', 3.35, 'g', 'Feeding 19 - Peach Fuzzy Mouse', 1),
         (1, '2024-10-31T08:00:00Z', 'Fuzzy Mouse', 3.55, 'g', 'Feeding 20 - Peach Fuzzy Mouse', 1),
         (1, '2024-11-14T08:00:00Z', 'Fuzzy Mouse', 3.65, 'g', 'Feeding 21 - Peach Fuzzy Mouse', 1),
         (1, '2024-11-28T08:00:00Z', 'Fuzzy Mouse', 3.75, 'g', 'Feeding 22 - Peach Fuzzy Mouse', 1),
         (1, '2024-12-12T08:00:00Z', 'Fuzzy Mouse', 3.95, 'g', 'Feeding 23 - Peach Fuzzy Mouse', 1),
         (1, '2024-12-26T08:00:00Z', 'Fuzzy Mouse', 5.15, 'g', 'Feeding 24 - Fuzzy Mouse', 1),
         (1, '2025-01-09T08:00:00Z', 'Fuzzy Mouse', 5.35, 'g', 'Feeding 25 - Fuzzy Mouse', 1),
         (1, '2025-01-23T08:00:00Z', 'Fuzzy Mouse', 5.55, 'g', 'Feeding 26 - Fuzzy Mouse', 0),
         (1, '2025-02-06T08:00:00Z', 'Fuzzy Mouse', 5.85, 'g', 'Feeding 27 - Fuzzy Mouse', 0),

      
         
         -- Pet 2: Feedings over 3 months (from 2025-02-01 to 2025-03-31)
         (2, '2024-11-08T09:00:00Z', 'Cricket', 0.5, 'g', 'Cricket', 1),
         (2, '2024-11-10T09:00:00Z', 'Cricket', 0.5, 'g', 'Cricket', 1),
         (2, '2024-11-12T09:00:00Z', 'Cricket', 0.5, 'g', 'Cricket', 1),
         (2, '2024-11-14T09:00:00Z', 'Mealworm', 0.3, 'g', 'Mealworm', 1),
         (2, '2024-11-16T09:00:00Z', 'Cricket', 0.5, 'g', 'Cricket', 1),
         (2, '2024-11-18T09:00:00Z', 'Mealworm', 0.3, 'g', 'Mealworm', 1),
         (2, '2024-11-20T09:00:00Z', 'Mealworm', 0.3, 'g', 'Mealworm', 1),
         (2, '2024-11-22T09:00:00Z', 'Mealworm', 0.3, 'g', 'Mealworm', 1),
         (2, '2024-11-24T09:00:00Z', 'Cricket', 0.5, 'g', 'Cricket', 1),
         (2, '2024-11-26T09:00:00Z', 'Cricket', 0.5, 'g', 'Cricket', 1),
         (2, '2024-11-28T09:00:00Z', 'Cricket', 0.5, 'g', 'Cricket', 1),
         (2, '2024-11-30T09:00:00Z', 'Cricket', 0.5, 'g', 'Cricket', 1),
         (2, '2024-12-02T09:00:00Z', 'Cricket', 0.5, 'g', 'Cricket', 1),
         (2, '2024-12-04T09:00:00Z', 'Mealworm', 0.3, 'g', 'Mealworm', 1),
         (2, '2024-12-06T09:00:00Z', 'Cricket', 0.5, 'g', 'Cricket', 1),
         (2, '2024-12-08T09:00:00Z', 'Mealworm', 0.3, 'g', 'Mealworm', 1),
         (2, '2024-12-10T09:00:00Z', 'Cricket', 0.5, 'g', 'Cricket', 1),
         (2, '2024-12-12T09:00:00Z', 'Cricket', 0.5, 'g', 'Cricket', 1),
         (2, '2024-12-14T09:00:00Z', 'Mealworm', 0.3, 'g', 'Mealworm', 1),
         (2, '2024-12-16T09:00:00Z', 'Mealworm', 0.3, 'g', 'Mealworm', 1),
         (2, '2024-12-18T09:00:00Z', 'Mealworm', 0.3, 'g', 'Mealworm', 1),
         (2, '2024-12-20T09:00:00Z', 'Mealworm', 0.3, 'g', 'Mealworm', 1),
         (2, '2024-12-22T09:00:00Z', 'Cricket', 0.5, 'g', 'Cricket', 1),
         (2, '2024-12-24T09:00:00Z', 'Cricket', 0.5, 'g', 'Cricket', 1),
         (2, '2024-12-26T09:00:00Z', 'Cricket', 0.5, 'g', 'Cricket', 1),
         (2, '2024-12-28T09:00:00Z', 'Cricket', 0.5, 'g', 'Cricket', 1),
         (2, '2024-12-30T09:00:00Z', 'Mealworm', 0.3, 'g', 'Mealworm', 1),
         (2, '2025-01-01T09:00:00Z', 'Cricket', 0.5, 'g', 'Cricket', 1),
         (2, '2025-01-03T09:00:00Z', 'Cricket', 0.5, 'g', 'Cricket', 1),
         (2, '2025-01-05T09:00:00Z', 'Cricket', 0.5, 'g', 'Cricket', 1),
         (2, '2025-01-07T09:00:00Z', 'Mealworm', 0.3, 'g', 'Mealworm', 1),
         (2, '2025-01-09T09:00:00Z', 'Cricket', 0.5, 'g', 'Cricket', 1),
         (2, '2025-01-11T09:00:00Z', 'Cricket', 0.5, 'g', 'Cricket', 1),
         (2, '2025-01-13T09:00:00Z', 'Cricket', 0.5, 'g', 'Cricket', 1),
         (2, '2025-01-15T09:00:00Z', 'Cricket', 0.5, 'g', 'Cricket', 1),
         (2, '2025-01-17T09:00:00Z', 'Cricket', 0.5, 'g', 'Cricket', 1),
         (2, '2025-01-19T09:00:00Z', 'Cricket', 0.5, 'g', 'Cricket', 1),
         (2, '2025-01-21T09:00:00Z', 'Cricket', 0.5, 'g', 'Cricket', 1),
         (2, '2025-01-23T09:00:00Z', 'Cricket', 0.5, 'g', 'Cricket', 1),
         (2, '2025-01-25T09:00:00Z', 'Mealworm', 0.3, 'g', 'Mealworm', 1),
         (2, '2025-01-27T09:00:00Z', 'Cricket', 0.5, 'g', 'Cricket', 1),
         (2, '2025-01-29T09:00:00Z', 'Mealworm', 0.3, 'g', 'Mealworm', 1),
         (2, '2025-01-31T09:00:00Z', 'Cricket', 0.5, 'g', 'Cricket', 0)

      
      
      `
    );

    // --------------------------------------------------
    // 5. Insert user profile
    // --------------------------------------------------
    await db.runAsync(
      `INSERT INTO users (id, name, photo, birthdate)
       VALUES (1, 'Ellis', 'https://avatars.githubusercontent.com/u/15618526?v=4', '1990-05-11')
       ON CONFLICT(id) DO UPDATE SET 
         name = excluded.name,
         photo = excluded.photo,
         birthdate = excluded.birthdate
      `
    );

    // --------------------------------------------------
    // 6. Insert sample freezer items
    // --------------------------------------------------
    await db.runAsync(
      `INSERT INTO freezer (preyType, quantity, weight, weightType)
       VALUES
         ('Mouse', 20, 0.05, 'kg'),
         ('Rat', 15, 0.1, 'kg'),
         ('Cricket', 50, 0.01, 'kg'),
         ('Vegetable', 10, 0.15, 'kg'),
         ('Fish', 8, 0.3, 'kg')
      `
    );

    // --------------------------------------------------
    // 7. Link feedings to freezer items
    // --------------------------------------------------
    /*await db.runAsync(
      `INSERT INTO freezer_link (feedingId, freezerId, quantityUsed)
       VALUES
         (1, 1, 1),
         (2, 1, 1),
         (3, 2, 1),
         (4, 3, 5),
         (5, 3, 5),
         (6, 3, 3),
         (7, 2, 1),
         (8, 2, 1),
         (9, 2, 1),
         (10, 4, 1),
         (11, 4, 1),
         (12, 5, 1),
         (13, 5, 1),
         (14, 5, 1),
         (15, 4, 1)
      `
    );*/

    console.log("Robust mock data inserted successfully.");
  } catch (error) {
    console.error("Error inserting robust mock data:", error);
  }
};
