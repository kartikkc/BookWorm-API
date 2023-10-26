const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const Book = require("../models/books");
const { body, validationResult } = require("express-validator");
const fetchuser = require("../middleware/fetchuser");
const User = require("../models/users");
router.use(bodyParser.json());
router.post("/", [
    body("name").exists(),
    body("author").exists(),
    body("gender").exists(),
    body("publisher").exists(),
    body("country").exists(),
], fetchuser, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const getID = req.user.id;
        const findUser = await User.findById(getID).select("-password");
        if (findUser) {
            const { name, author, gender, publisher, country } = req.body;
            let book = await Book.findOne({ name: name });
            if (book) {
                res.json({ "Status": "The book with the same name already exsits" });
            }
            else {
                const addBook = await Book.create({
                    name: name,
                    author: author,
                    gender: gender,
                    publisher: publisher,
                    country: country
                });
                res.json(addBook);
            }
        }
        else {
            res.status(401).json({ Status: "You are not logged-in to make any changes" });
        }
    }
    catch (error) {
        res.status(500).json({ "status": "Some error occured" });
        console.log(error);
    }
})


module.exports = router;

