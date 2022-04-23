require("dotenv").config();
const nodemailer = require("nodemailer");
const { CourierClient } = require("@trycourier/courier");
const sendResponse = require("./sendResponse");

const { EMAIL_NAME, AUTH_TOKEN, EVENT_ID } = process.env;

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
        return res.status(500).json({
            message: err.message,
            success: false,
        });
    }
};

// const courier = CourierClient({ authorizationToken: AUTH_TOKEN });
// const sendUesrMail = (res, options, data) => {
//     let { email, message, link } = options;
//     courier
//         .send({
//             eventId: EVENT_ID, // your Notification ID
//             profile: {
//                 email: EMAIL_NAME,
//             },
//             message: {
//                 to: { email },
//                 template: "SB854GNXN84NK2HJCG0HS4NKEKAE",
//                 data: {
//                     recipientName: email,
//                     contentEmail: message,
//                     linkConfirm: link,
//                 },
//             },
//         })
//         .then(() => sendResponse(res, data.message))
//         .catch((error) => {
//             console.log(error);
//             return res.status(500).json({
//                 message: err.message,
//                 success: false,
//             });
//         });
// };

module.exports = sendUesrMail;
