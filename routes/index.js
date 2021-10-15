const authRouter = require("./auth");
const homeRouter = require("./home");
const categoryRouter = require("./category");
const errHandle = require("../middleware/errorHandle");

const route = (app) => {
    app.use("/api/auth", authRouter);
    app.use("/api/categories", categoryRouter);
    app.use("/", homeRouter);
    app.use(errHandle);
};

module.exports = route;
