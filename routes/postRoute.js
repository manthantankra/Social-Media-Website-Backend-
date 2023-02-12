import express from "express";
import {
    createPost,
    getPost,
    updatePost,
    deletePost,
    likePost,
    getTimelinePosts
} from "../Controllers/postController.js";
const router = express.Router();

router.post('/', createPost);
router.get('/:id', getPost);
router.put('/:id', updatePost);
router.delete("/:id", deletePost);
router.put("/like/:id", likePost);
router.get("/timeline/:id", getTimelinePosts);

export default router;