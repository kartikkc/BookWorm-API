require("dotenv").config();
const { connect } = require("http2");
const mongoose = require("mongoose");

const mongodbUrl = process.env.MONGODBURL;

const connectToMongo = async () => {
    try {

        const connected = await mongoose.connect(mongodbUrl,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true
            })
        if (connected) {
            console.log("[Status] Connected to the Database");
        }
    }
    catch (error) {
        console.log(error);
    }
}

module.exports = connectToMongo;