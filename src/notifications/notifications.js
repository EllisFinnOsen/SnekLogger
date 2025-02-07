// File: notifications.js
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { setHours, setMinutes, setSeconds } from "date-fns";
import { openDatabase } from "@/database";

// Handle foreground notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function registerForPushNotificationsAsync() {
  //console.log("Requesting notification permissions...");
  const { status } = await Notifications.getPermissionsAsync();
  //console.log("Notification permission status:", status);

  if (status !== "granted") {
    const { status: newStatus } = await Notifications.requestPermissionsAsync();
    //console.log("New notification permission status:", newStatus);

    if (newStatus !== "granted") {
      //console.log("Push notifications permission not granted.");
      return;
    }
  }

  const token = (await Notifications.getExpoPushTokenAsync()).data;
  //console.log("Notification Token:", token);

  return token;
}

export async function scheduleFeedingNotifications() {
  try {
    const db = await openDatabase();
    const today = new Date().toISOString().split("T")[0];
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowDate = tomorrow.toISOString().split("T")[0];

    // Fetch all incomplete feedings (not marked complete)
    const feedings = await db.getAllAsync(
      `SELECT id, petId, feedingDate, preyType, feedingTime 
       FROM feedings WHERE complete = 0`
    );

    if (feedings.length === 0) {
      //console.log("No incomplete feedings found.");
      return;
    }

    for (const feeding of feedings) {
      const { feedingDate, petId, preyType, feedingTime } = feeding;

      // Fetch pet name
      const pet = await db.getFirstAsync("SELECT name FROM pets WHERE id = ?", [
        petId,
      ]);
      const petName = pet ? pet.name : "your pet";

      // Format feeding message
      const preyText = preyType ? `${preyType} feeding` : "feeding";

      if (feedingDate === today) {
        // Today's feeding reminder
        await Notifications.scheduleNotificationAsync({
          content: {
            title: "Feeding Reminder 🐾",
            body: `${petName} needs their ${preyText} today at ${feedingTime}.`,
            sound: true,
          },
          trigger: { seconds: 10 }, // TESTING: Trigger after 10 seconds
        });
        //console.log(`Scheduled feeding reminder for today (pet: ${petName})`);
      } else if (feedingDate === tomorrowDate) {
        // Tomorrow's feeding reminder
        await Notifications.scheduleNotificationAsync({
          content: {
            title: "Upcoming Feeding 📅",
            body: `Reminder: ${petName} has a ${preyText} scheduled for tomorrow at ${feedingTime}.`,
            sound: true,
          },
          trigger: { seconds: 10 }, // TESTING: Trigger after 10 seconds
        });
        /*console.log(
          `Scheduled feeding reminder for tomorrow (pet: ${petName})`
        );*/
      } else if (feedingDate < today) {
        // Missed feeding reminder
        await Notifications.scheduleNotificationAsync({
          content: {
            title: "Missed Feeding Alert ❗",
            body: `${petName} missed their ${preyText} on ${feedingDate}. Log it as complete when done!`,
            sound: true,
          },
          trigger: { seconds: 10 }, // TESTING: Trigger after 10 seconds
        });
        //console.log(`Scheduled missed feeding alert (pet: ${petName})`);
      }
    }
  } catch (error) {
    //console.error("Error scheduling feeding notifications:", error);
  }
}

export async function triggerTestNotification() {
  //console.log("Triggering test notification...");
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Test Notification 🎉",
        body: "This is a test to confirm push notifications are working.",
        sound: true,
      },
      trigger: null, // Immediate trigger
    });
    //console.log("Notification should have been triggered.");
  } catch (error) {
    //console.error("Error triggering test notification:", error);
  }
}

export async function checkScheduledNotifications() {
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  //console.log("Scheduled Notifications:", scheduled);
}
