const { models } = require("mongoose");
const asyncHandle = require("./asynHandle");

const queryResults = (model) =>
    asyncHandle(async (req, res, next) => {
        let query;

        const reqQuery = { ...req.query };
        const removeFields = ["sort", "page", "limit"];

        removeFields.forEach((key) => delete reqQuery[key]);

        let queryStr = JSON.stringify(reqQuery);

        queryStr = queryStr.replace(
            /(gte|gt|lt|lte|eq|in)/g,
            (match) => "$" + match
        );

        const conditions = JSON.parse(queryStr);

        if (req.query.search) {
            conditions.$text = { $search: req.query.search };
        }

        query = model.find({ conditions });

        if (req.query.sort) {
            const sortBy = { ...req.query.sort };
            query.sort(sortBy);
        } else {
            query.sort("-createdAt");
        }

        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 4;
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit - 1;
        const total = await model.countDocuments(conditions);

        const paginations = {};
        const queryResults = await query;
    });
