const connection = require("./config/mongoDB");
var cors = require("cors");
const express = require("express");
const route = require("./routes/index");
const app = express();
require("dotenv").config();

// connect to mongoBD
connection();

// use route
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
route(app);
// Listen server
const port = process.env.PORT || 2800;
app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`);
});
