import User from "../models/user.js";
import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken";

// registering a new user
export const register = async (req, res) => {
    console.log(req.body, 'body');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    req.body.password = hashedPassword;
    const { username } = req.body;

    try {
        const oldUser = await User.findOne({ username });
        if (oldUser) {
            return res.status(400).json("user is already registered");
        }

        const newUser = new User(req.body);
        const user = await newUser.save();
        const token = jwt.sign({
            username: user.username,
            id: user._id
        }, process.env.JWT_KEY, {
            expiresIn: '1h'
        })
        res.status(200).json({
            success: true,
            newUser,
            token
        });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

// login a user

export const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username: username });

        if (user) {
            const validity = await bcrypt.compare(password, user.password);

            if (!validity) {
                res.status(400).json("wrong password");
            } else {
                const token = jwt.sign(
                    { username: user.username, id: user._id },
                    process.env.JWT_KEY,
                    { expiresIn: "1h" }
                );
                res.status(200).json({
                    success: true,
                    user,
                    token
                });
            }
        } else {
            res.status(404).json("User not found");
        }
    } catch (err) {
        res.status(500).json(err);
    }
}
