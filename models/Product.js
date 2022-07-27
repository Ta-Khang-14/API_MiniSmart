const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const ProductScheme = new Schema(
    {
        title: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        pictures: [
            {
                type: String,
                trim: true,
                default: [],
            },
        ],
        price: {
            type: Number,
            required: true,
            default: 0,
        },
        discount: {
            type: Number,
            default: 0,
        },
        sellNumber: {
            type: Number,
            default: 0,
        },
        country: {
            type: String,
            trim: true,
            required: true,
        },
        unit: {
            type: String,
            trim: true,
        },
        postedBy: {
            type: Schema.Types.ObjectId,
            ref: "users",
        },
        category: {
            type: Schema.Types.ObjectId,
            ref: "categories",
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

ProductScheme.index({
    title: "text",
});
module.exports = mongoose.model("products", ProductScheme);
