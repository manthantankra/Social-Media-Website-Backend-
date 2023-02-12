import express from 'express'
import {
    getUser,
    updateUser,
    deleteUser,
    followUser,
    unfollowUser
} from '../controllers/userController.js';


const router = express.Router();

router
    .get('/:id', getUser)
    .put('/:id', updateUser)
    .delete('/:id', deleteUser);

router.put("/follow/:id", followUser);
router.put("/unfollow/:id", unfollowUser);


export default router;