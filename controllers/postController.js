import mongoose from 'mongoose';
import Post from "../models/post.js";
import User from "../models/user.js";

// create new post
export const createPost = async (req, res) => {
    const newPost = new Post(req.body);

    try {
        const post = await newPost.save();
        res.status(200).json({
            success: true,
            post
        })
    } catch (error) {
        res.status(500).json(error.message);
    }
}

// Get a post

export const getPost = async (req, res) => {
    const id = req.params.id

    try {
        const post = await Post.findById(id);
        res.status(200).json({
            success: true,
            post
        })
    } catch (error) {
        res.status(500).json(error.message);
    }
}

// update a post
export const updatePost = async (req, res) => {
    const postId = req.params.id;
    const { userId } = req.body;

    try {
        const post = await Post.findById(postId);
        if (post.userId === userId) {
            await Post.updateOne({ $set: req.body });
            res.status(200).json("Post Updated");
        }
        else {
            res.status(403).json({ msg: "You are not allowed to update the post" });
        }
    } catch (error) {
        res.status(500).json(error.message);
    }
}

// Delete a post
export const deletePost = async (req, res) => {
    const id = req.params.id;
    const { userId } = req.body;

    try {
        const post = await Post.findById(id);
        if (post.userId === userId) {
            await post.deleteOne();
            res.status(200).json({
                success: true
            });
        } else {
            res.status(403).json({ msg: "you are not allowed to delete the post" });
        }
    } catch (error) {
        res.status(500).json(error);
    }
};

// like/dislike a post
export const likePost = async (req, res) => {
    const id = req.params.id;
    const { userId } = req.body;

    try {
        const post = await Post.findById(id);
        if (!post.likes.includes(userId)) {
            await post.updateOne({ $push: { likes: userId } });
            res.status(200).json({
                success: true,
                msg: "Post Liked"
            });
        } else {
            await post.updateOne({ $pull: { likes: userId } });
            res.status(200).json({
                success: true,
                msg: "Post Unliked"
            });
        }
    } catch (error) {
        res.status(500).json(error);
    }
};

// Get Timeline Posts
export const getTimelinePosts = async (req, res) => {
    const userId = req.params.id;

    try {
        const currentUserPosts = await Post.find({ userId: userId });
        const followingPosts = await User.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(userId),
                },
            },
            {
                $lookup: {
                    from: "posts",
                    localField: "following",
                    foreignField: "userId",
                    as: "followingPosts",
                },
            },
            {
                $project: {
                    followingPosts: 1,
                    _id: 0,
                },
            },
        ]);

        res
            .status(200)
            .json(currentUserPosts.concat(...followingPosts[0].followingPosts)
                .sort((a, b) => {
                    return b.createdAt - a.createdAt;
                })
            );
    } catch (error) {
        res.status(500).json(error.message);
    }
};