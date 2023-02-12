import User from "../models/user.js";
import bcrypt from 'bcrypt'

// Get a user 

export const getUser = async (req, res) => {
    const id = req.params.id;
    try {
        const user = await User.findById(id);
        if (user) {
            // user.password = undefined; // One method to not show the password
            const { password, ...otherDetails } = user._doc; // Another method to hide the password

            res.status(200).json({
                success: true,
                otherDetails
            });
        }
        else {
            res.status(404).json({ msg: "user not found" });
        }
    } catch (error) {
        res.status(500).json(error.message);
    }
}

// Update a user 

export const updateUser = async (req, res) => {
    const id = req.params.id;

    const user = await User.findById(id);
    const { currentUserId, currentUserAdminStatus, password } = req.body;

    if (id === currentUserId || currentUserAdminStatus) {
        try {
            if (password) {
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(password, 10);
            }
            const user = await User.findByIdAndUpdate(id, req.body,
                {
                    new: true,
                    runValidators: true
                })

            res.status(200).json({
                success: true,
                user
            })
        } catch (error) {
            res.status(500).json(error.message);
        }
    }
    else {
        res.status(403).json({
            msg: "Access Denied! you can only update your profile"
        })
    }
}

// Delete a user

export const deleteUser = async (req, res) => {
    const id = req.params.id;

    const { currentUserId, currentUserAdminStatus } = req.body;

    if (currentUserId === id || currentUserAdminStatus) {
        try {
            await User.findByIdAndDelete(id);
            res.status(200).json({ success: true, msg: "User deleted successfully" });
        } catch (error) {
            res.status(500).json(error.message);
        }
    }
    else {
        res.status(403).json("Access Denies! you can only delete your own profile");
    }
}

// Follow a user

export const followUser = async (req, res) => {
    const id = req.params.id; // User who should be follow

    const { currentUserId } = req.body; //user who wants to follow 

    if (currentUserId === id) // user can't follow him or herself
    {
        res.status(403).json('Action forbidden');
    }
    else {
        try {
            const followUser = await User.findById(id);
            const followingUser = await User.findById(currentUserId);

            if (!followUser.followers.includes(currentUserId)) {
                await followUser.updateOne({ $push: { followers: currentUserId } });
                await followingUser.updateOne({ $push: { following: id } });
                res.status(200).json('user followed!');
            }
            else{
                res.status(403).json("User is already followed by you");
            }
        } catch (error) {
            res.status(500).json(error.message);
        }
    }
}

// unfollow a user

export const unfollowUser = async (req, res) => {
    const id = req.params.id; // User who should be follow

    const { currentUserId } = req.body; //user who wants to follow 

    if (currentUserId === id) // user can't follow him or herself
    {
        res.status(403).json('Action forbidden');
    }
    else {
        try {
            const followUser = await User.findById(id);
            const followingUser = await User.findById(currentUserId);

            if (followUser.followers.includes(currentUserId)) {
                await followUser.updateOne({ $pull: { followers: currentUserId } });
                await followingUser.updateOne({ $pull: { following: id } });
                res.status(200).json('user unfollowed!');
            }
            else{
                res.status(403).json("User is not followed by you");
            }
        } catch (error) {
            res.status(500).json(error.message);
        }
    }
}