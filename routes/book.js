const express = require("express");
const router = express.Router();
const Book = require("../models/books.js");
router.get("/", async (req, res) => {
    const books = await Book.find();
    if (books) {
        res.json(books);
    }
    else {
        res.json({ "Status": "there are no books in this db" });
    }
})

module.exports = router;