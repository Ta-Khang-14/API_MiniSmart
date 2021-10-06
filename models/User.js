const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
        match: /^[a-zA-Z]{2,}$/,
        trim: true,
    },
    surname: {
        type: String,
        required: true,
        match: /^[a-zA-Z]{2,}$/,
        trim: true,
    },
    phone: {
        type: String,
        match: /^[0-9]{9,}$/,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        trim: true,
        match: /^[a-zA-Z0-9]{4,}$/,
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user",
    },
});

module.exports = mongoose.model("users", UserSchema);
