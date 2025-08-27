const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({

    photo: {
        type: String,
        require: true
    },

    title: {
        type: String,
        require: true
    },
    description: {
        type: String,
        require: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    comments: [{
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        message: {
            type: String,
            required: true
        },
        isDeleted: {
            type: Boolean,
            default: false
        },
    }]
}, { timestamps: true })

const Blog = mongoose.model("blogModel", blogSchema)
module.exports = Blog