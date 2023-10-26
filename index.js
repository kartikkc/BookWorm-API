require("dotenv").config();
const express = require("express");
const connectToMongo = require("./db.js");
const app = express();
connectToMongo();

const port = process.env.PORT || 3000;
// Registering yourself in order to edit the book details and all
app.use("/book/", require("./routes/userAuth.js"));
// getting all the books
app.use("/books", require("./routes/book.js"));
// adding the books
app.use("/books", require("./routes/addBook.js"));
// Selecting the speicfic book
app.use("/books/", require("./routes/specificBook.js"));
app.listen(port, (req, res) => {
    console.log("[Status] App is running on PORT:" + port);
})
