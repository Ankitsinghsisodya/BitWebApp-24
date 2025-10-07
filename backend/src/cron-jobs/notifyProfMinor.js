import cron from "node-cron";
import nodemailer from "nodemailer";
import { User } from "../models/user.model.js";
import { Professor } from "../models/professor.model.js";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.AUTH_EMAIL,
    pass: process.env.AUTH_PASSWORD,
  },
});

async function sendMinorNotificationEmail(professor) {
  const mailOptions = {
    from: process.env.AUTH_EMAIL,
    to: professor.email,
    subject: "Minor Project Applications Pending Review",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #f9f9f9;">
        <h2 style="color: #333; text-align: center;">Hello Professor ${professor.fullName},</h2>
        <p style="color: #555;">You have pending student applications for minor projects that require your attention.</p>
        
        <div style="background-color: #fff; padding: 15px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <h3 style="color: #444;">Current Details:</h3>
          <ul style="color: #555; line-height: 1.6;">
            <li><strong>Current Minor Project Students:</strong> ${professor.currentCount.minor_project}</li>
            <li><strong>Maximum Limit:</strong> ${professor.limits.minor_project}</li>
            <li><strong>Pending Applications:</strong> ${professor.appliedGroups.minor_project.length}</li>
          </ul>
        </div>

        <p style="margin-top: 15px; color: #555;">Please <a href="https://bitacademia.vercel.app/faculty-login" style="color: #007bff; text-decoration: none; font-weight: bold;">log in</a> to the system to review these applications.</p>

        <div style="text-align: center; margin-top: 20px;">
          <a href="https://bitacademia.vercel.app/faculty-login" style="background-color: #007bff; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-size: 16px;">Review Applications</a>
        </div>

        <p style="margin-top: 20px; color: #777; font-size: 12px; text-align: center;">Best regards,<br><strong>BITACADEMIA</strong></p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Minor project email sent successfully to ${professor.email}`);
  } catch (error) {
    console.error(`Error sending minor project email to ${professor.email}:`, error);
  }
}

const checkAndNotifyMinorProf = async () => {
  try {
    const allProfs = await Professor.find().populate(
      "appliedGroups.minor_project"
    );
    const eligibleProfs = allProfs.filter((prof) => {
      const { currentCount, limits, appliedGroups } = prof;
      const hasSpace = currentCount.minor_project < limits.minor_project;
      const hasPendingApplications = appliedGroups.minor_project.length > 0;
      return hasSpace && hasPendingApplications;
    });
    console.log("eligible minor project profs:", eligibleProfs);
    console.log(`📢 Notifying ${eligibleProfs.length} professors for minor projects...`);
    await Promise.all(eligibleProfs.map((prof) => sendMinorNotificationEmail(prof)));
    console.log("✅ All eligible professors have been notified for minor projects.");
  } catch (error) {
    console.log("Error in checkAndNotifyMinorProfessors:", error);
  }
};

cron.schedule(
  "30 0 * * *",
  () => {
    console.log("Running minor project notification task every day at 6:15 AM IST");
    checkAndNotifyMinorProf();
  },
  {
    timezone: "UTC",
  }
);

export { checkAndNotifyMinorProf };
