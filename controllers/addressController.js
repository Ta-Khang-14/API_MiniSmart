const asyncHandle = require("../middleware/asynHandle");
const Address = require("../models/Address");
const ErrorResponse = require("../helpers/ErrorResponse");
const sendResponse = require("../helpers/sendResponse");

// @route [POST] /api/address/
// @desc create a new address
// @access private
const createAddress = asyncHandle(async (req, res, next) => {
    const userId = req.userId;
    const {
        name,
        phone,
        company = "",
        city = "",
        district = "",
        village = "",
    } = req.body;

    // simple validate user id
    if (!userId) {
        return next(new ErrorResponse("Id not found", 404));
    }

    // simple validate input
    if (!name || !phone) {
        return next(new ErrorResponse("Missing information", 400));
    }

    // create address
    const address = new Address({
        user: userId,
        name,
        phone,
        company,
        city,
        district,
        village,
    });

    await address.save();

    // all good
    sendResponse(res, "Create address successfully", { address });
});

// @route [GET] /api/address/
// @desc get address
// @access private
const getAddress = asyncHandle(async (req, res, next) => {
    const userId = req.userId;

    // simple validate user id
    if (!userId) {
        return next(new ErrorResponse("User id not found", 404));
    }

    // get address
    const matchAddress = await Address.find({ user: userId });

    sendResponse(res, "Get address successfully", { address: matchAddress });
});

// @route [PUT] /api/address/:addressId
// @desc update address infor
// @access private
const updateAddressInfor = asyncHandle(async (req, res, next) => {
    const userId = req.userId;
    const { name, phone, company, city, district, village } = req.body;
    const addressId = req.params.addressId;
    const updateInfor = {
        name,
        phone,
        company,
        city,
        district,
        village,
    };

    // simple validate user id
    if (!userId) {
        return next(new ErrorResponse("User id not found", 404));
    }

    // simple validate user id
    if (!addressId) {
        return next(new ErrorResponse("Address Id not found", 404));
    }

    Object.keys(updateInfor).forEach((element) => {
        if (!updateInfor[element]) delete updateInfor[element];
    });

    // find address
    const matchAddress = await Address.findByIdAndUpdate(
        addressId,
        updateInfor,
        { new: true }
    );

    if (!matchAddress) {
        return next(new ErrorResponse("Address not found", 404));
    }

    sendResponse(res, "Update address successfully", { address: matchAddress });
});
// @route [DELETE] /api/address/:addressId
// @desc delete address
// @access private
const deleteAddress = asyncHandle(async (req, res, next) => {
    const userId = req.userId;
    const addressId = req.params.addressId;

    // simple validate user id
    if (!userId) {
        return next(new ErrorResponse("User id not found", 404));
    }

    // simple validate user id
    if (!addressId) {
        return next(new ErrorResponse("Address Id not found", 404));
    }

    // delete address
    const deleteAddress = await Address.deleteOne({ _id: addressId });

    if (!deleteAddress) {
        return next(new ErrorResponse("Address not found", 404));
    }

    sendResponse(res, "Delete address successfully", {});
});
module.exports = {
    createAddress,
    getAddress,
    updateAddressInfor,
    deleteAddress,
};
