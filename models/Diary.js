const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const DiarySchema = new Schema({
    productId: {
        type: Schema.Types.ObjectId,
        ref: "products",
    },
    nameProduct: {
        type: String,
    },
    updatedBy: [
        {
            type: Schema.Types.ObjectId,
            ref: "users",
        },
    ],
    updatedAt: [
        {
            type: Date,
        },
    ],
    message: [
        {
            type: Array,
        },
    ],
    isDeleted: {
        type: Boolean,
        default: false,
    },
});

module.exports = mongoose.model("diaries", DiarySchema);
