const asyncHandle = require("../middleware/asynHandle");
const ErrorResponse = require("../helpers/ErrorResponse");
const sendResponse = require("../helpers/sendResponse");
const Post = require("../models/Post");

// @route [POST] /api/posts/
// @desc create new post
// @access private
const createPost = asyncHandle(async (req, res, next) => {
    const { title, description } = req.body;
    const userId = req.userId;
    const pictures = req.pictures;

    // simple validate
    if (!title || !description || !userId) {
        return next(new ErrorResponse("Missing information", 400));
    }

    // validate title
    const matchPost = await Post.findOne({ title });
    if (matchPost) {
        return next(new ErrorResponse("Title has taken", 400));
    }

    // all good
    const newPost = new Post({
        title,
        description,
        pictures,
        postedBy: userId,
    });

    await newPost.save();

    sendResponse(res, "Create new post successfully!", { post: newPost });
});

// @route [GET] /api/posts/
// @desc get list posts
// @access public
const getPosts = asyncHandle(async (req, res, next) => {
    const posts = await Post.find().populate({
        path: "postedBy",
        select: "name",
    });

    if (!posts) {
        return next(new ErrorResponse("Post not found"));
    }

    sendResponse(res, "Get posts successfully", { posts });
});

// @route [GET] /api/posts/:id
// @desc get posts by id
// @access public
const getPostById = asyncHandle(async (req, res, next) => {
    const id = req.params.id;

    // validate id
    if (!id) {
        return next(new ErrorResponse("Id not found", 404));
    }

    //check post
    const matchPost = await Post.findById(id);
    if (!matchPost) {
        return next(new ErrorResponse("Post not found", 404));
    }

    sendResponse(res, "Get post by id successfully", { post: matchPost });
});
// @route [PUT] /api/posts/:id
// @desc update posts by id
// @access private
const updatePostById = asyncHandle(async (req, res, next) => {
    let { title, description, pictures } = req.body;
    const newPictures = req.newPictures;
    const id = req.params.id;
    console.log(req.body);
    pictures = JSON.parse(pictures);

    if (newPictures) {
        pictures = pictures.concat(newPictures);
    }

    // validate update info
    const updateInformation = {
        title,
        description,
        pictures,
    };

    Object.keys(updateInformation).forEach((key) => {
        if (!updateInformation[key]) delete updateInformation[key];
    });

    // validate id
    if (!id) {
        return next(new ErrorResponse("Id not found", 404));
    }
    // validate title
    if (updateInformation["title"]) {
        const matchPost = await Post.findOne({
            title: updateInformation["title"],
        });
        if (matchPost) {
            return next(new ErrorResponse("Title has taken", 400));
        }
    }

    // check post
    const updatedPost = await Post.findByIdAndUpdate(id, updateInformation, {
        new: true,
    });

    if (!updatedPost) {
        return next(new ErrorResponse("Post not found"));
    }

    // all good
    sendResponse(res, "Updated post successfully", { post: updatedPost });
});

// @route [DELETE] /api/posts/:id
// @desc update posts by id
// @access private

const deletePostById = asyncHandle(async (req, res, next) => {
    const id = req.params.id;

    // validate id
    if (!id) {
        return next(new ErrorResponse("Id not found", 404));
    }

    // delete
    const deletedPost = await Post.deleteOne({ _id: id });

    if (!deletedPost) {
        return next(new ErrorResponse("Post not found"));
    }

    // all good
    sendResponse(res, "Deleted post successfully", { post: deletedPost });
});
module.exports = {
    createPost,
    getPosts,
    getPostById,
    updatePostById,
    deletePostById,
};
