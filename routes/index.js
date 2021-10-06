const authRouter = require("./auth");
const errHandle = require("../middleware/errorHandle");

const route = (app) => {
    app.use("/api/auth", authRouter);
    app.use(errHandle);
};

module.exports = route;
