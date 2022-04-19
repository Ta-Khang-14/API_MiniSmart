require("dotenv").config();
const nodemailer = require("nodemailer");
const sendResponse = require("./sendResponse");
const { EMAIL_NAME, PASS_USER, MAIL_HOST, MAIL_PORT } = process.env;

const sendUesrMail = async (res, options, data) => {
    try {
        let { email, subject, message, link } = options;
        link = link || "";

        const transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: EMAIL_NAME,
                pass: PASS_USER,
            },
        });

        const content = {
            from: `MiniMart <${EMAIL_NAME}>`,
            to: email,
            subject,
            html: `${message}<br /><a href="${link}">${link}</a>`,
        };

        await transporter.sendMail(content);

        sendResponse(res, data.message);
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: err.message,
            success: false,
        });
    }
};

module.exports = sendUesrMail;
