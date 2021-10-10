const authRouter = require("./auth");
const homeRouter = require("./home");
const errHandle = require("../middleware/errorHandle");

const route = (app) => {
    app.use("/api/auth", authRouter);
    app.use("/", homeRouter);
    app.use(errHandle);
};

module.exports = route;
