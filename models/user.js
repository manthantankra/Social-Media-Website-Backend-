import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },

    password: {
        type: String,
        required: true,
    },

    firstname: {
        type: String,
        required: true,
    },

    lastname: {
        type: String,
        required: true,
    },

    isAdmin: {
        type: Boolean,
        default: false
    },

    profilePicture: {
        type: Boolean,
    },
    coverPicture: String,
    about: String,
    livesin: String,
    workAt: String,
    relationship: String,
    followers: [],
    following: []
},
    { timestamps: true }
)

const User = mongoose.model('User', userSchema);

export default User;