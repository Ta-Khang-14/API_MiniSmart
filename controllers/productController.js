const asyncHandle = require("../middleware/asynHandle");
const Diary = require("../models/Diary");
const Product = require("../models/Product");
const ErrorResponse = require("../helpers/ErrorResponse");
const sendResponse = require("../helpers/sendResponse");
const { updateInfor } = require("./userController");

// @route [POST] /api/products/
// @desc create a new product
// @access private
const createProduct = asyncHandle(async (req, res, next) => {
    const userId = req.userId;
    const pictures = req.pictures;
    const {
        title,
        description,
        price,
        discount,
        quantity,
        country,
        unit,
        category,
    } = req.body;

    // validate input
    if (!userId) {
        return next(new ErrorResponse("Id not found", 404));
    }

    if (
        !title ||
        !description ||
        !price ||
        !quantity ||
        !country ||
        !category
    ) {
        return next(new ErrorResponse("Missing information", 400));
    }

    // check title
    const oldProduct = await Product.findOne({ title });
    if (oldProduct) {
        return next(new ErrorResponse("Title has taken", 400));
    }

    //  all good
    const newProduct = new Product({
        title,
        description,
        pictures,
        price,
        discount,
        quantity,
        country,
        unit,
        postedBy: userId,
        category,
    });
    await newProduct.save();

    // create new diary
    const newDiary = new Diary({
        productId: newProduct._id,
        nameProduct: newProduct.title,
        message: "Tạo sản phẩm.",
    });
    newDiary.updatedBy.push(userId);
    newDiary.updatedAt.push(newProduct.createdAt);
    await newDiary.save();

    sendResponse(res, "Create new product successfully", {
        product: newProduct,
    });
});

// @route [GET] /api/products/
// @desc get list products
// @access public
const getProducts = asyncHandle(async (req, res, next) => {
    const products = await Product.find();

    if (!products) {
        return next(new ErrorResponse("Products not found", 404));
    }

    sendResponse(res, "Get list products successfully", { products });
});
// @route [GET] /api/products/:id
// @desc get product by id
// @access public
const getProductById = asyncHandle(async (req, res, next) => {
    const productId = req.params.id;

    if (!productId) {
        return next(new ErrorResponse("Product ID not found", 404));
    }
    const product = await Product.findById(productId);

    if (!product) {
        return next(new ErrorResponse("Product not found", 404));
    }

    sendResponse(res, "Get product by id successfully", { product });
});
// @route [PUT] /api/products/:id
// @desc update product by id
// @access private
const updateProductById = asyncHandle(async (req, res, next) => {
    const userId = req.userId;
    const productId = req.params.id;
    const newPictures = req.pictures;
    const {
        title,
        description,
        price,
        discount,
        pictures,
        quantity,
        country,
        unit,
        category,
    } = req.body;

    const updateInfor = {
        title,
        description,
        pictures,
        price,
        discount,
        quantity,
        country,
        unit,
        category,
    };
    // check add new pictures
    if (!newPictures) {
        pictures.push(newPictures);
    }

    // validate update information
    Object.keys(updateInfor).forEach((key) => {
        if (!updateInfor[key]) delete updateInfor[key];
    });
    if (updateInfor["title"]) {
        const findProduct = await Product.findOne({
            title,
            _id: { $ne: productId },
        });
        if (findProduct) {
            return next(new ErrorResponse("Title has taken", 400));
        }
    }
    // validate user id
    if (!userId) {
        return next(new ErrorResponse("User Id not found", 404));
    }

    // validate product id
    if (!productId) {
        return next(new ErrorResponse("Product id not found", 404));
    }

    // check product
    const matchProduct = await Product.findById(productId);
    const matchDiary = await Diary.findOne({ productId });

    if (!matchProduct) {
        return next(new ErrorResponse("Product not found", 404));
    }
    if (!matchDiary) {
        return next(new ErrorResponse("Diary not found", 404));
    }
    // update dairy & procuct
    let message = [];

    Object.keys(updateInfor).forEach((key) => {
        message.push(
            `+ ${key.toUpperCase()}: ${matchProduct[key]} -> ${
                updateInfor[key]
            }`
        );
        matchProduct[key] = updateInfor[key];
    });

    matchDiary.nameProduct = matchProduct.title;
    matchDiary.updatedBy.push(userId);
    matchDiary.updatedAt.push(new Date());
    matchDiary.message.push(message);

    await matchProduct.save();
    await matchDiary.save();
    // all good
    sendResponse(res, "Update product successfully", { product: matchProduct });
});

// @route [DELETE] /api/products/:id
// @desc delete product by id
// @access private
const deleteProductById = asyncHandle(async (req, res, next) => {
    const userId = req.userId;
    const productId = req.params.id;

    //check userid
    if (!userId) {
        return next(new ErrorResponse("User id not found", 404));
    }
    //check prduct id
    if (!productId) {
        return next("Product Id not found", 404);
    }

    // delete product
    const result = await Product.deleteOne({ _id: productId });
    if (!result) {
        return next("Product not found", 404);
    }

    //update dairies
    const matchDiary = await Diary.findOneAndUpdate(
        { productId: productId },
        { isDeleted: true }
    );
    if (!matchDiary) {
        return next("Diary not found", 404);
    }
    // all good
    sendResponse(res, "Deleted Product by id successfully");
});
// @route [DELETE] /api/products/
// @desc delete products
// @access private
const deleteProducts = asyncHandle(async (req, res, next) => {
    const userId = req.userId;
    const { productIds } = req.body;

    //check userid
    if (!userId) {
        return next(new ErrorResponse("User id not found", 404));
    }

    //check prduct id
    if (!productIds) {
        return next("Product Ids not found", 404);
    }

    // delete product
    const result = await Product.deleteMany({ _id: { $in: productIds } });
    console.log(result);
    if (!result) {
        return next("Products not found", 404);
    }

    // update dairies
    const matchDiaries = await Diary.updateMany(
        {
            productId: { $in: productIds },
        },
        { isDeleted: true }
    );
    if (!matchDiaries) {
        return next("Diaries not found", 404);
    }
    sendResponse(res, "Deleted Products successfully");
});
module.exports = {
    createProduct,
    getProducts,
    getProductById,
    updateProductById,
    deleteProductById,
    deleteProducts,
};