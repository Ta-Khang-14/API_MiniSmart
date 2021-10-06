const mongoose = require("mongoose");

const connection = async () => {
    try {
        await mongoose.connect(
            `mongodb+srv://${process.env.MONGOBD_NAME}:${process.env.MONGOBD_PASSWORD}@learnmongo.lykg4.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`
        );

        console.log("Connect successfully!");
    } catch (err) {
        console.log(err.message);
        console.log("Connect falure!");
    }
};

module.exports = connection;
