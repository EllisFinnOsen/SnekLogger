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
         ('Max', 'Lizards', 'Leopard Gecko', 'Normal', '2019-04-10', 0.09, 'kg', 'https://www.cbreptile.com/wp-content/smush-webp/2018/04/tangerine-leopard-gecko.jpg.webp'),
         ('Alby', 'Snakes', 'Ball Python', 'Albino', '2022-01-01', 2.5, 'kg', 'https://www.worldofballpythons.com/files/morphs/albino/014.jpg'),
         ('Buddy', 'Lizards', 'Bearded Dragon', 'Normal', '2018-07-20', 0.45, 'kg', 'https://www.awsfzoo.com/media/Corn-Snake-Website-906x580.jpg'),
         ('Luna', 'Turtles', 'Red-Eared Slider', 'Normal', '2017-03-12', 1.0, 'kg', 'https://futureoftheocean.wordpress.com/wp-content/uploads/2016/07/rw13-299_cropped.jpg?w=825&h=510&crop=1')
      `
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
      `INSERT INTO feedings (petId, feedingDate, feedingTime, preyType, preyWeight, preyWeightType, notes, complete)
       VALUES
         -- Pet 1: Feedings over 6 months (from 2025-02-01 to 2025-07-01)
         (1, '2024-02-08', '08:00:00', 'Pinky Mouse', 1.75, 'g', 'Feeding 1 - Extra-Small Pinky Mouse', 1),
         (1, '2024-02-22', '08:00:00', 'Pinky Mouse', 1.85, 'g', 'Feeding 2 - Extra-Small Pinky Mouse', 1),
         (1, '2024-03-07', '08:00:00', 'Pinky Mouse', 1.95, 'g', 'Feeding 3 - Extra-Small Pinky Mouse', 1),
         (1, '2024-03-21', '08:00:00', 'Pinky Mouse', 2.00, 'g', 'Feeding 4 - Extra-Small Pinky Mouse', 1),
         (1, '2024-04-04', '08:00:00', 'Pinky Mouse', 2.14, 'g', 'Feeding 5 - Extra-Small Pinky Mouse', 1),
         (1, '2024-04-18', '08:00:00', 'Pinky Mouse', 2.25, 'g', 'Feeding 6 - Small Pinky Mouse', 1),
         (1, '2024-05-02', '08:00:00', 'Pinky Mouse', 2.28, 'g', 'Feeding 7 - Small Pinky Mouse', 1),
         (1, '2024-05-16', '08:00:00', 'Pinky Mouse', 2.3, 'g', 'Feeding 8 - Small Pinky Mouse', 1),
         (1, '2024-05-30', '08:00:00', 'Pinky Mouse', 2.4, 'g', 'Feeding 9 - Small Pinky Mouse', 1),
         (1, '2024-06-13', '08:00:00', 'Pinky Mouse', 2.5, 'g', 'Feeding 10 - Small Pinky Mouse', 1),
         (1, '2024-06-27', '08:00:00', 'Pinky Mouse', 2.25, 'g', 'Feeding 11 - Small Pinky Mouse', 1),
         (1, '2024-07-11', '08:00:00', 'Pinky Mouse', 2.75, 'g', 'Feeding 12 - Large Pinky Mouse', 1),
         (1, '2024-07-25', '08:00:00', 'Pinky Mouse', 2.9, 'g', 'Feeding 13 - Large Pinky Mouse', 1),
         (1, '2024-08-08', '08:00:00', 'Pinky Mouse', 2.95, 'g', 'Feeding 14 - Large Pinky Mouse', 1),
         (1, '2024-08-22', '08:00:00', 'Pinky Mouse', 2.9, 'g', 'Feeding 15 - Large Pinky Mouse', 1),
         (1, '2024-09-05', '08:00:00', 'Pinky Mouse', 2.95, 'g', 'Feeding 16 - Large Pinky Mouse', 1),
         (1, '2024-09-19', '08:00:00', 'Pinky Mouse', 3.00, 'g', 'Feeding 17 - Large Pinky Mouse', 1),
         (1, '2024-10-03', '08:00:00', 'Fuzzy Mouse', 3.15, 'g', 'Feeding 18 - Peach Fuzzy Mouse', 1),
         (1, '2024-10-17', '08:00:00', 'Fuzzy Mouse', 3.35, 'g', 'Feeding 19 - Peach Fuzzy Mouse', 1),
         (1, '2024-10-31', '08:00:00', 'Fuzzy Mouse', 3.55, 'g', 'Feeding 20 - Peach Fuzzy Mouse', 1),
         (1, '2024-11-14', '08:00:00', 'Fuzzy Mouse', 3.65, 'g', 'Feeding 21 - Peach Fuzzy Mouse', 1),
         (1, '2024-11-28', '08:00:00', 'Fuzzy Mouse', 3.75, 'g', 'Feeding 22 - Peach Fuzzy Mouse', 1),
         (1, '2024-12-12', '08:00:00', 'Fuzzy Mouse', 3.95, 'g', 'Feeding 23 - Peach Fuzzy Mouse', 1),
         (1, '2024-12-26', '08:00:00', 'Fuzzy Mouse', 5.15, 'g', 'Feeding 24 - Fuzzy Mouse', 1),
         (1, '2025-01-09', '08:00:00', 'Fuzzy Mouse', 5.35, 'g', 'Feeding 25 - Fuzzy Mouse', 1),
         (1, '2025-01-23', '08:00:00', 'Fuzzy Mouse', 5.55, 'g', 'Feeding 26 - Fuzzy Mouse', 0),
         (1, '2025-02-06', '08:00:00', 'Fuzzy Mouse', 5.85, 'g', 'Feeding 27 - Fuzzy Mouse', 0),
      
         
         -- Pet 2: Feedings over 3 months (from 2025-02-01 to 2025-03-31)
         (2, '2024-11-08', '09:00:00', 'Cricket', 0.5, 'g', 'Cricket', 1),
         (2, '2024-11-10', '09:00:00', 'Cricket', 0.5, 'g', 'Cricket', 1),
         (2, '2024-11-12', '09:00:00', 'Cricket', 0.5, 'g', 'Cricket', 1),
         (2, '2024-11-14', '09:00:00', 'Mealworm', 0.3, 'g', 'Mealworm', 1),
         (2, '2024-11-16', '09:00:00', 'Cricket', 0.5, 'g', 'Cricket', 1),
         (2, '2024-11-18', '09:00:00', 'Mealworm', 0.3, 'g', 'Mealworm', 1),
         (2, '2024-11-20', '09:00:00', 'Mealworm', 0.3, 'g', 'Mealworm', 1),
         (2, '2024-11-22', '09:00:00', 'Mealworm', 0.3, 'g', 'Mealworm', 1),
         (2, '2024-11-24', '09:00:00', 'Cricket', 0.5, 'g', 'Cricket', 1),
         (2, '2024-11-26', '09:00:00', 'Cricket', 0.5, 'g', 'Cricket', 1),
         (2, '2024-11-28', '09:00:00', 'Cricket', 0.5, 'g', 'Cricket', 1),
         (2, '2024-11-30', '09:00:00', 'Cricket', 0.5, 'g', 'Cricket', 1),
         (2, '2024-12-02', '09:00:00', 'Cricket', 0.5, 'g', 'Cricket', 1),
         (2, '2024-12-04', '09:00:00', 'Mealworm', 0.3, 'g', 'Mealworm', 1),
         (2, '2024-12-06', '09:00:00', 'Cricket', 0.5, 'g', 'Cricket', 1),
         (2, '2024-12-08', '09:00:00', 'Mealworm', 0.3, 'g', 'Mealworm', 1),
         (2, '2024-12-10', '09:00:00', 'Cricket', 0.5, 'g', 'Cricket', 1),
         (2, '2024-12-12', '09:00:00', 'Cricket', 0.5, 'g', 'Cricket', 1),
         (2, '2024-12-14', '09:00:00', 'Mealworm', 0.3, 'g', 'Mealworm', 1),
         (2, '2024-12-16', '09:00:00', 'Mealworm', 0.3, 'g', 'Mealworm', 1),
         (2, '2024-12-18', '09:00:00', 'Mealworm', 0.3, 'g', 'Mealworm', 1),
         (2, '2024-12-20', '09:00:00', 'Mealworm', 0.3, 'g', 'Mealworm', 1),
         (2, '2024-12-22', '09:00:00', 'Cricket', 0.5, 'g', 'Cricket', 1),
         (2, '2024-12-24', '09:00:00', 'Cricket', 0.5, 'g', 'Cricket', 1),
         (2, '2024-12-26', '09:00:00', 'Cricket', 0.5, 'g', 'Cricket', 1),
         (2, '2024-12-28', '09:00:00', 'Cricket', 0.5, 'g', 'Cricket', 1),
         (2, '2024-12-30', '09:00:00', 'Mealworm', 0.3, 'g', 'Mealworm', 1),
         (2, '2025-01-01', '09:00:00', 'Cricket', 0.5, 'g', 'Cricket', 1),
         (2, '2025-01-03', '09:00:00', 'Cricket', 0.5, 'g', 'Cricket', 1),
         (2, '2025-01-05', '09:00:00', 'Cricket', 0.5, 'g', 'Cricket', 1),
         (2, '2025-01-07', '09:00:00', 'Mealworm', 0.3, 'g', 'Mealworm', 1),
         (2, '2025-01-09', '09:00:00', 'Cricket', 0.5, 'g', 'Cricket', 1),
         (2, '2025-01-11', '09:00:00', 'Cricket', 0.5, 'g', 'Cricket', 1),
         (2, '2025-01-13', '09:00:00', 'Cricket', 0.5, 'g', 'Cricket', 1),
         (2, '2025-01-15', '09:00:00', 'Cricket', 0.5, 'g', 'Cricket', 1),
         (2, '2025-01-17', '09:00:00', 'Cricket', 0.5, 'g', 'Cricket', 1),
         (2, '2025-01-19', '09:00:00', 'Cricket', 0.5, 'g', 'Cricket', 1),
         (2, '2025-01-21', '09:00:00', 'Cricket', 0.5, 'g', 'Cricket', 1),
         (2, '2025-01-23', '09:00:00', 'Cricket', 0.5, 'g', 'Cricket', 1),
         (2, '2025-01-25', '09:00:00', 'Mealworm', 0.3, 'g', 'Mealworm', 1),
         (2, '2025-01-27', '09:00:00', 'Cricket', 0.5, 'g', 'Cricket', 1),
         (2, '2025-01-29', '09:00:00', 'Mealworm', 0.3, 'g', 'Mealworm', 1),
         (2, '2025-01-31', '09:00:00', 'Cricket', 0.5, 'g', 'Cricket', 0),
      
         
         -- Pet 3: Feedings over 1 month (from 2025-02-01 to 2025-02-28)
         (3, '2025-02-01', '10:00:00', 'Rat',   0.20, 'kg', '1-month feeding 1', 0),
         (3, '2025-02-08', '10:00:00', 'Rat',   0.20, 'kg', '1-month feeding 2', 1),
         (3, '2025-02-15', '10:00:00', 'Rat',   0.20, 'kg', '1-month feeding 3', 1),
         (3, '2025-02-22', '10:00:00', 'Rat',   0.20, 'kg', '1-month feeding 4', 1),
         (3, '2025-02-28', '10:00:00', 'Rat',   0.20, 'kg', '1-month feeding 5', 1),
         
         -- Pet 4: Feedings over 1 week (from 2025-02-01 to 2025-02-07)
         (4, '2025-02-01', '11:00:00', 'Vegetable', 0.15, 'kg', '1-week feeding 1', 1),
         (4, '2025-02-02', '11:00:00', 'Vegetable', 0.15, 'kg', '1-week feeding 2', 1),
         (4, '2025-02-03', '11:00:00', 'Insect',    0.02, 'kg', '1-week feeding 3', 0),
         (4, '2025-02-04', '11:00:00', 'Vegetable', 0.15, 'kg', '1-week feeding 4', 1),
         (4, '2025-02-05', '11:00:00', 'Vegetable', 0.15, 'kg', '1-week feeding 5', 1),
         (4, '2025-02-06', '11:00:00', 'Insect',    0.02, 'kg', '1-week feeding 6', 0),
         (4, '2025-02-07', '11:00:00', 'Vegetable', 0.15, 'kg', '1-week feeding 7', 1)
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
