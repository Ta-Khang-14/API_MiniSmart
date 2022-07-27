const asyncHandle = require("../middleware/asynHandle");
const Diary = require("../models/Diary");
const Product = require("../models/Product");
const Category = require("../models/Category");
const ErrorResponse = require("../helpers/ErrorResponse");
const sendResponse = require("../helpers/sendResponse");

// @route [POST] /api/products/
// @desc create a new product
// @access private
const createProduct = asyncHandle(async (req, res, next) => {
    const userId = req.userId;
    const pictures = req.pictures;
    const { title, description, price, discount, country, unit, category } =
        req.body;

    // get pictures name
    const pictureNames = [];
    pictures.forEach((item) => {
        pictureNames.push(item.split("/").pop());
    });
    console.log(pictureNames);
    // validate input
    if (!userId) {
        req.destroy = pictureNames;
        return next(new ErrorResponse("Id not found", 404));
    }

    if (!title || !description || !price || !country || !category) {
        req.destroy = pictureNames;
        return next(new ErrorResponse("Missing information", 400));
    }

    // check title
    const oldProduct = await Product.findOne({ title });
    if (oldProduct) {
        req.destroy = pictureNames;
        return next(new ErrorResponse("Title has taken", 400));
    }

    //  all good
    const newProduct = new Product({
        title,
        description,
        price,
        discount,
        pictures,
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
    if (!res.advancedResults.data) {
        return next(new ErrorResponse("Products not found", 404));
    }

    sendResponse(res, "Get list products successfully", {
        products: res.advancedResults.data,
        pagination: res.advancedResults.pagination,
    });
});
// @route [GET] /api/products/category/:id
// @desc get product by category id
// @access public
const getProductByCategoryId = asyncHandle(async (req, res, next) => {
    const categoryId = req.params.id;
    const category = await Category.findById(categoryId);

    if (!category) {
        return next(new ErrorResponse("Category ID not found", 404));
    }

    const products = await Product.find({
        category: categoryId,
        isDeleted: false,
    });

    sendResponse(res, "Get products by category id successfully", { products });
});
// @route [GET] /api/products/:id
// @desc get product by id
// @access public
const getProductById = asyncHandle(async (req, res, next) => {
    const productId = req.params.id;
    console.log(productId);

    if (!productId) {
        return next(new ErrorResponse("Product ID not found", 404));
    }
    const product = await Product.findOne({
        _id: productId,
        isDeleted: false,
    }).exec();

    console.log(product);

    if (!product) {
        return next(new ErrorResponse("Product not found", 404));
    }

    if (product.isDeleted) {
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
    const newPictures = req.newPictures;
    let {
        title,
        description,
        price,
        discount,
        pictures,
        country,
        unit,
        category,
    } = req.body;

    pictures = JSON.parse(pictures);

    // check add new pictures
    if (newPictures) {
        pictures = pictures.concat(newPictures);
    }

    const updateInfor = {
        title,
        description,
        pictures,
        price,
        discount,
        country,
        unit,
        category,
    };

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
    const result = await Product.updateOne(
        { _id: productId },
        { isDeleted: true }
    );
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
    console.log("productIds: " + productIds);
    console.log(req.body);

    //check userid
    if (!userId) {
        return next(new ErrorResponse("User id not found", 404));
    }

    //check prduct id
    if (!productIds) {
        return next("Missing information", 400);
    }

    // delete product
    const result = await Product.updateMany(
        { _id: { $in: productIds } },
        { isDeleted: true }
    );
    console.log(result + "1111");
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
    console.log("matchDiaries: " + matchDiaries);
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
    getProductByCategoryId,
};
