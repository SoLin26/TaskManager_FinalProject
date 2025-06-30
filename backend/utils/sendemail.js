import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false, // Für Port 587 (STARTTLS)
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  },
  tls: {
    rejectUnauthorized: false // Bei GMX manchmal nötig
  }
});

export const sendemail = async (recipientEmail, token, boardTitle) => {
  const invitationLink = `https://deinfrontend.de/accept-invitation?token=${token}`;

  const mailOptions = {
    from: `"Board App" <${process.env.SMTP_USER}>`,
    to: recipientEmail,
    subject: `Einladung zum Board: ${boardTitle}`,
    html: `
      <p>Du wurdest zu einem Board eingeladen.</p>
      <p>Klicke auf folgenden Link, um die Einladung anzunehmen:</p>
      <a href="${invitationLink}">${invitationLink}</a>
      <p>Der Link ist 24 Stunden gültig.</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`E-Mail erfolgreich gesendet an: ${recipientEmail}`);
  } catch (error) {
    console.error("Fehler beim Senden der E-Mail:", error);
    throw error;
  }
};
