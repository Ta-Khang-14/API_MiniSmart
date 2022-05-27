const asyncHandle = require("../middleware/asynHandle");
const ErrorResponse = require("../helpers/ErrorResponse");
const sendResponse = require("../helpers/sendResponse");
const Diary = require("../models/Diary");

// @route [GET] /api/diaries/
// @desc get list diaries
// @access private
const getDiaries = asyncHandle(async (req, res, next) => {
    const diaries = await Diary.find();

    if (!diaries) {
        return next(new ErrorResponse("Diaries not found", 404));
    }

    sendResponse(res, "Get diaries successfully", { diaries });
});

// @route [GET] /api/diaries/:id
// @desc get diary by Id
// @access private
const getDiaryById = asyncHandle(async (req, res, next) => {
    const diaryId = req.params.id;

    if (!diaryId) {
        return next(new ErrorResponse("Diary id not found", 404));
    }
    const matchDiary = await Diary.findById(diaryId);

    if (!matchDiary) {
        return next(new ErrorResponse("Diary not found", 404));
    }

    sendResponse(res, "Get diary by id successfully", { diary: matchDiary });
});

// @route [GET] /api/diaries/product/:id
// @desc get diary by product id
// @access private
const getDiaryByProductId = asyncHandle(async (req, res, next) => {
    const productId = req.params.id;

    if (!productId) {
        return next(new ErrorResponse("Product id not found", 404));
    }
    const matchDiary = await Diary.findOne({ productId });

    if (!matchDiary) {
        return next(new ErrorResponse("Diary not found", 404));
    }

    sendResponse(res, "Get diary by product id successfully", {
        diary: matchDiary,
    });
});

module.exports = {
    getDiaries,
    getDiaryById,
    getDiaryByProductId,
};
