require("dotenv").config();
const passport = require("passport");
var GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");
const jwt = require("jsonwebtoken");

// const { GG_CLIENT_ID, GG_CLIENT_SECRET, GG_REDIRECT_URL_1 } = process.env;

// passport.use(
//     new GoogleStrategy(
//         {
//             clientID: GG_CLIENT_ID,
//             clientSecret: GG_CLIENT_SECRET,
//             callbackURL: GG_REDIRECT_URL_1,
//         },
//         async function (accessToken, refreshToken, profile, cb) {
//             const { displayName, emails } = profile;

//             const newUser = new User({
//                 name: displayName,
//                 email: emails[0].values,
//                 password: "ádhjkjhrjkr324324j32hk",
//             });

//             await newUser.save();
//             console.log(newUser);
//         }
//     )
// );

// module.exports = passport;
