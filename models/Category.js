const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const CategorySchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
});

module.exports = mongoose.model("categories", CategorySchema);
