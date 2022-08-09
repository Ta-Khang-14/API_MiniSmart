require("dotenv").config();
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const { OAuth2 } = google.auth;
const sendResponse = require("./sendResponse");
const {
    GG_CLIENT_ID,
    GG_CLIENT_SECRET,
    GG_CLIENT_REFESH_TOKEN,
    GG_REDIRECT_URL2,
} = process.env;

const oauth2Client = new OAuth2(
    GG_CLIENT_ID,
    GG_CLIENT_SECRET,
    GG_REDIRECT_URL2
);
const { EMAIL_NAME, PASS_USER } = process.env;

const sendUesrMail = async (res, options, data) => {
    try {
        oauth2Client.setCredentials({
            refresh_token: GG_CLIENT_REFESH_TOKEN,
        });
        const accessToken = await oauth2Client.getAccessToken();

        let { email, subject, message, link } = options;
        link = link || "";

        const transporter = await nodemailer.createTransport({
            service: "Gmail",
            auth: {
                type: "OAuth2",
                user: EMAIL_NAME,
                clientId: GG_CLIENT_ID,
                clientSecret: GG_CLIENT_SECRET,
                refreshToken: GG_CLIENT_REFESH_TOKEN,
                accessToken,
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

        sendResponse(res, data);
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: err.message,
            success: false,
        });
    }
};

module.exports = sendUesrMail;
