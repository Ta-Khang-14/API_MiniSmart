const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const PostSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        prictures: [
            {
                type: String,
            },
        ],
        postedBy: {
            type: Schema.Types.ObjectId,
            ref: "users",
        },
        postedAt: {
            Schema: Date,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("posts", PostSchema);
