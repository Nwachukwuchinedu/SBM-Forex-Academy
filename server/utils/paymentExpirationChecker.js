import mongoose from "mongoose";
import cron from "node-cron";
import Payment from "../models/Payment.js";
import User from "../models/User.js";
import bot from "./telegramBot.js";

// Function to check for expiring/expired payments and send notifications
const checkPaymentExpirations = async () => {
  try {
    console.log("Running payment expiration check...");

    // Get current date
    const now = new Date();

    // Calculate date 7 days from now for upcoming expirations
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);

    // Find payments that are about to expire (within 7 days) but haven't been notified yet
    const upcomingExpirations = await Payment.find({
      status: "completed",
      expirationDate: { $lte: sevenDaysFromNow, $gte: now },
      startDate: { $ne: null },
      expirationDate: { $ne: null },
    }).populate("userId");

    console.log(`Found ${upcomingExpirations.length} upcoming expirations`);

    // Notify users about upcoming expirations
    for (const payment of upcomingExpirations) {
      try {
        const user = payment.userId;
        if (user && user.telegramId) {
          // Calculate days until expiration
          const daysUntilExpiration = Math.ceil(
            (payment.expirationDate - now) / (1000 * 60 * 60 * 24)
          );

          // Send notification about upcoming expiration
          await bot.telegram.sendMessage(
            user.telegramId,
            `<b>🔔 Payment Expiration Reminder</b>\n\n` +
              `Your payment for <b>${
                payment.service.name
              }</b> will expire in <b>${daysUntilExpiration} day${
                daysUntilExpiration !== 1 ? "s" : ""
              }</b>.\n\n` +
              `To continue receiving services, please renew your payment before ${payment.expirationDate.toLocaleDateString()}.\n\n` +
              `Click here to renew: /start`,
            { parse_mode: "HTML" }
          );

          console.log(
            `Sent upcoming expiration notification to user ${user._id}`
          );
        }
      } catch (error) {
        console.error(
          `Error sending upcoming expiration notification for payment ${payment._id}:`,
          error
        );
      }
    }

    // Find payments that have already expired
    const expiredPayments = await Payment.find({
      status: "completed",
      expirationDate: { $lt: now },
      startDate: { $ne: null },
      expirationDate: { $ne: null },
    }).populate("userId");

    console.log(`Found ${expiredPayments.length} expired payments`);

    // Notify users about expired payments
    for (const payment of expiredPayments) {
      try {
        const user = payment.userId;
        if (user && user.telegramId) {
          // Calculate days since expiration
          const daysSinceExpiration = Math.floor(
            (now - payment.expirationDate) / (1000 * 60 * 60 * 24)
          );

          // Check if we should send a notification (within 7 days after expiration)
          if (daysSinceExpiration <= 7) {
            // Check if we've already sent a notification today
            let shouldSendNotification = true;
            if (user.lastExpirationNotification) {
              const lastNotificationDate = new Date(
                user.lastExpirationNotification
              );
              lastNotificationDate.setHours(0, 0, 0, 0);
              const today = new Date();
              today.setHours(0, 0, 0, 0);

              if (lastNotificationDate.getTime() === today.getTime()) {
                // Already sent notification today, check count
                if (user.expirationNotificationCount >= 1) {
                  shouldSendNotification = false;
                }
              }
            }

            if (shouldSendNotification) {
              // Send daily expiration reminder
              await bot.telegram.sendMessage(
                user.telegramId,
                `<b>⚠️ Payment Expired</b>\n\n` +
                  `Your payment for <b>${
                    payment.service.name
                  }</b> expired <b>${daysSinceExpiration} day${
                    daysSinceExpiration !== 1 ? "s" : ""
                  } ago</b> on ${payment.expirationDate.toLocaleDateString()}.\n\n` +
                  `To continue receiving services, please renew your payment now.\n\n` +
                  `Click here to renew: /start`,
                { parse_mode: "HTML" }
              );

              // Update user notification tracking
              user.lastExpirationNotification = new Date();
              user.expirationNotificationCount =
                (user.expirationNotificationCount || 0) + 1;
              await user.save();

              console.log(`Sent expiration notification to user ${user._id}`);
            }
          }
        }
      } catch (error) {
        console.error(
          `Error sending expiration notification for payment ${payment._id}:`,
          error
        );
      }
    }

    console.log("Payment expiration check completed");
  } catch (error) {
    console.error("Error in payment expiration check:", error);
  }
};

// Schedule the job to run daily at 9:00 AM
const schedulePaymentExpirationChecker = () => {
  // Run every day at 9:00 AM
  cron.schedule("0 9 * * *", checkPaymentExpirations);
  console.log("Payment expiration checker scheduled to run daily at 9:00 AM");

  // Also run immediately when starting (for testing)
  // checkPaymentExpirations();
};

export { schedulePaymentExpirationChecker, checkPaymentExpirations };
