const mongoose = require("mongoose");
const { Schema } = mongoose;
const Bookschema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true

    },
    author: {
        type: String
    },
    gender: {
        type: String
    },
    publisher: {
        type: String
    },
    country: {
        type: String
    }
})

module.exports = mongoose.model('Book', Bookschema);