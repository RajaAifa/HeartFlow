import nodemailer from "nodemailer";

const sendEmail = async (email, subject, html) => {
    try {
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false, 
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        await transporter.verify();
        console.log("✅ SMTP connection ready");

        console.log("📧 Sending email to:", email);

        const info = await transporter.sendMail({
            from: `"HeartFlow" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: subject,
            html: html
        });

        console.log("✅ Email sent:", info.messageId);

    } catch (error) {
        console.error("❌ Email failed:");
        console.error(error.message);

        if (error.response) {
            console.error("SMTP Response:", error.response);
        }
    }
};

export default sendEmail;