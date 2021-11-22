const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const AddressShema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "users",
        },
        name: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
            required: true,
        },
        company: {
            type: String,
        },
        city: {
            type: String,
        },
        district: {
            type: String,
        },
        village: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);
module.exports = mongoose.model("address", AddressShema);
