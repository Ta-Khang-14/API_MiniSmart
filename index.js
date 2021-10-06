const connection = require("./config/mongoDB");
const express = require("express");
const route = require("./routes/index");
const app = express();
require("dotenv").config();

// connect to mongoBD
connection();
// use route
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
route(app);
// Listen server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`);
});
