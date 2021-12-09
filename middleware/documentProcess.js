const asyncHandle = require("./asynHandle");

const queryResults = (model) =>
    asyncHandle(async (req, res, next) => {
        let query;

        const reqQuery = { ...req.query };
        console.log(req.query);
        const removeFields = ["sort", "page", "limit"];

        removeFields.forEach((key) => delete reqQuery[key]);

        let queryStr = JSON.stringify(reqQuery);

        queryStr = queryStr.replace(
            /(gte|gt|lt|lte|eq|in)/g,
            (match) => "$" + match
        );

        const conditions = { ...JSON.parse(queryStr) };

        if (req.query.search) {
            console.log("Search");
            conditions.$text = { $search: req.query.search };
        }

        console.log("Find");
        query = model.find(conditions);

        if (req.query.sort) {
            console.log("Sort-1");
            const sortBy = req.query.sort.split(",").join(" ");
            query = query.sort(sortBy);
        } else {
            console.log("Sort-2");
            query = query.sort("-createdAt");
        }

        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 5;
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const total = await model.countDocuments(conditions);

        console.log("Skip");
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
        console.log("End");
        res.advancedResults = {
            data: queryResults,
            pagination,
        };

        next();
    });

module.exports = queryResults;
