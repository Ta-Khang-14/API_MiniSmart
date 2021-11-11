const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const OrderShema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "users",
        },
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        address: {
            type: String,
        },
        note: {
            type: String,
        },
        products: [
            {
                type: Schema.Types.ObjectId,
                ref: "products",
            },
        ],
        quantity: [
            {
                type: Number,
                default: 1,
            },
        ],
        city: {
            type: String,
        },
        district: {
            type: String,
        },
        sumMoney: {
            type: Number,
            required: true,
            default: 0,
        },
        status: {
            type: String,
            enum: ["Processing", "Done", "Deleted"],
            default: "Processing",
        },
    },
    {
        timestamps: true,
    }
);
module.exports = mongoose.model("orders", OrderShema);
