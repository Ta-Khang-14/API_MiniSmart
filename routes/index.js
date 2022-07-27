const authRouter = require("./auth");
const homeRouter = require("./home");
const postRouter = require("./post");
const productRouter = require("./product");
const categoryRouter = require("./category");
const diaryRouter = require("./diary");
const errHandle = require("../middleware/errorHandle");
const cartRouter = require("./cart");
const orderRouter = require("./order");
const addressRouter = require("./address");
const adminRouter = require("./admin");

const route = (app) => {
    app.use("/api/auth/", authRouter);
    app.use("/api/categories/", categoryRouter);
    app.use("/api/posts/", postRouter);
    app.use("/api/products/", productRouter);
    app.use("/api/diaries/", diaryRouter);
    app.use("/api/cart/", cartRouter);
    app.use("/api/orders/", orderRouter);
    app.use("/api/address/", addressRouter);
    app.use("/api/admin/", adminRouter);
    app.use("/", homeRouter);
    app.use(errHandle);
};

module.exports = route;
