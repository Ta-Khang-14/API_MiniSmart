require("dotenv").config();
const nodemailer = require("nodemailer");

const sendUesrMail = async (options) => {
    const { email, subject, message } = options;

    const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
            user: process.env.EMAIL_NAME,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    const content = {
        from: `MiniSmart <${process.env.EMAIL_NAME}>`,
        to: email,
        subject,
        text: message,
    };

    await transporter.sendMail(content);
};

module.exports = sendUesrMail;
