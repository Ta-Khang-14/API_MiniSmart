const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const CartShema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "users",
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
    },
    {
        timestamps: true,
    }
);
module.exports = mongoose.model("carts", CartShema);
