const asyncHandle = require("./asynHandle");

const queryResults = (model) =>
    asyncHandle(async (req, res, next) => {
        let query;

        const reqQuery = { ...req.query };
    });
