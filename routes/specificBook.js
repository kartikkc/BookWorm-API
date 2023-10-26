const express = require("express");
const router = express.Router();
const Book = require("../models/books");
const User = require("../models/users");
const bodyParser = require("body-parser");
const { body, validationResult } = require("express-validator");
const fetchuser = require("../middleware/fetchuser");
router.use(bodyParser.json());

router.get("/:id", async (req, res) => {
    try {

        const { id } = req.params;
        const findBook = await Book.findOne({ _id: id });
        if (findBook) {
            res.json(findBook);
        }
        else {
            res.status(404).json({ "Status": "The book you are trying to find does not exists" });
        }
    }
    catch (error) {
        res.status(500).json({ "status": "Some error occured" });
        console.log(error);
    }
})

router.put("/:id", fetchuser, async (req, res) => {
    try {
        const getID = req.user.id;
        const findUser = await User.findById(getID).select("-password");
        if (findUser) {
            const { id } = req.params;
            const { name, author, gender, publisher, country } = req.body;
            const findBook = await Book.findOne({ _id: id });
            if (findBook) {
                const updateBook = await Book.updateOne({
                    _id: id
                },
                    {
                        name: name,
                        author: author,
                        gender: gender,
                        publisher: publisher,
                        country: country
                    });
                res.json({ "Status": "The document is updated Succesfully" });
            }
            else {
                res.status(404).json({ "Status": "The book you are trying to find does not exists" });
            }
        }
        else {
            res.json({ "Status": "You are not logged-in to make any changes" });
        }
    }
    catch (error) {
        res.status(500).json({ "status": "Some error occured" });
        console.log(error);
    }
})

router.delete("/:id", fetchuser, async (req, res) => {
    try {
        const getID = req.user.id;
        const findUser = await User.findById(getID).select("-password");
        if (findUser) {

            const { id } = req.params;
            const deleteBook = await Book.findOne({ _id: id });
            if (deleteBook) {
                const deletedBook = await Book.deleteOne({ _id: id });
                res.json({ "Status": "The book is deleted Succesfully" });
            }
            else {
                res.status(404).json({ "Status": "The book you are trying to find does not exists" });
            }
        }
        else {
            res.status(401).json({ "Status": "You are not logged-in to make any changes" });
        }
    }
    catch (error) {
        res.status(500).json({ "status": "Some error occured" });
        console.log(error);
    }
})
module.exports = router;