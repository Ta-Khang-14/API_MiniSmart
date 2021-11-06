require("dotenv").config();
const nodemailer = require("nodemailer");

const sendUesrMail = async (res, options) => {
    try {
        let { email, subject, message, link } = options;
        link = link || "";
        const transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: process.env.EMAIL_NAME,
                pass: process.env.EMAIL_PASSWORD,
            },
        });
        const content = {
            from: `MiniMart <${process.env.EMAIL_NAME}>`,
            to: email,
            subject,
            html: `${message}<br /><a href="${link}">${link}</a>`,
        };

        await transporter.sendMail(content);
    } catch (err) {
        return res.status(500).json({
            message: err.message,
            success: false,
        });
    }
};

module.exports = sendUesrMail;
