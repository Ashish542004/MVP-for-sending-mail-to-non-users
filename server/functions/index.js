const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");
const { generateEmailContent } = require("./emailGenerator");

admin.initializeApp();
const db = admin.firestore();

// Nodemailer Setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: functions.config().email.user,
    pass: functions.config().email.pass,
  },
});

exports.sendReferralEmails = functions.https.onRequest(async (req, res) => {
  try {
    const usersSnapshot = await db.collection("users").get();
    const users = usersSnapshot.docs.map((doc) => doc.data());

    for (const user of users) {
      if (!user.email || !user.referralCode) {
        continue;
      }

      const emailContent = await generateEmailContent(user);

      const mailOptions = {
        from: functions.config().email.user,
        to: user.email,
        subject: "Invite Your Friends & Earn Rewards!",
        html: emailContent,
      };

      await transporter.sendMail(mailOptions);
      console.log(`Email sent to: ${user.email}`);
    }

    res.status(200).send("Emails sent successfully!");
  } catch (error) {
    console.error("Error sending emails:", error);
    res.status(500).send("Error sending emails.");
  }
});
