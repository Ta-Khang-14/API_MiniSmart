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

        let conditions = { ...JSON.parse(queryStr) };
        conditions = { ...conditions, isDeleted: false };

        if (req.query.search) {
            conditions.$text = { $search: req.query.search };
        }

        query = model.find(conditions);

        if (req.query.sort) {
            const sortBy = req.query.sort.split(",").join(" ");
            query = query.sort(sortBy);
        } else {
            query = query.sort("-createdAt");
        }

        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 5;
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const total = await model.countDocuments(conditions);

        query = query.skip(startIndex).limit(limit);

        const queryResults = await query;
        const pagination = {};

        if (endIndex < total) {
            pagination["next"] = page + 1;
        }

        if (startIndex > 0) {
            pagination["prev"] = page - 1;
        }

        pagination["limit"] = limit;
        pagination["total"] = total;
        res.advancedResults = {
            data: queryResults,
            pagination,
        };

        next();
    });

module.exports = queryResults;
