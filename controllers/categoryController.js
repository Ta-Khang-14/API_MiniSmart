const asyncHandle = require("../middleware/asynHandle");
const Category = require("../models/Category");
const ErrorResponse = require("../helpers/ErrorResponse");
const sendResponse = require("../helpers/sendResponse");

// @route [GET] /api/categories/
// @desc get list categoris
// @access public
const getCategories = asyncHandle(async (req, res, next) => {
    const categories = await Category.find();
    if (!categories) {
        next(new ErrorResponse("Categories not found", 404));
    }
    sendResponse(res, "Get categories successfully", { categories });
});

// @route [POST] /api/categories/
// @desc create new category
// @access private
const createCategory = asyncHandle(async (req, res, next) => {
    const { categoryName } = req.body;

    // simple validate
    if (!categoryName) {
        return next(new ErrorResponse("Missing information", 404));
    }

    // all good
    const newCategory = new Category({
        name: categoryName,
    });

    await newCategory.save();
    sendResponse(res, "Create new category successfully");
});
// @route [POST] /api/categories/
// @desc create new category
// @access private

module.exports = {
    createCategory,
    getCategories,
};
