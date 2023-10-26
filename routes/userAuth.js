require("dotenv").config();
const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const { body, validationResult } = require("express-validator");
const User = require("../models/users");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
JWT_SECRET = process.env.JWT_SECRET;
router.use(bodyParser.json());

router.post("/register", [
    body("name").exists(),
    body("email").isEmail(),
    body("password").exists(),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { name, email, password } = req.body;
        const findUser = await User.findOne({ email: email });
        if (findUser) {
            res.status(302).json({ "Status": "The User is already registered please sign-in" });
        }
        else {
            const salt = await bcrypt.genSalt(10);
            const newPass = await bcrypt.hash(password, salt);
            const user = {
                name: name,
                email: email,
                password: newPass
            }
            const createUser = await User.create(user);
            const data = {
                user: {
                    id: user.id
                }
            }
            const authToken = jwt.sign(data, JWT_SECRET);
            res.json({ "Status": "User is registered Succesfully", authToken: authToken });
        }
    }
    catch (error) {
        res.status(500).json({ "status": "Some error occured" });
        console.log(error);
    }
})

router.post("/login", [
    body("email").isEmail(),
    body("password").exists()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
    }
    try {
        const { email, password } = req.body;
        const findUser = await User.findOne({ email: email });
        if (findUser) {
            const foundUser = await bcrypt.compare(password, findUser.password);
            if (foundUser) {
                const data = {
                    user: {
                        id: findUser.id
                    }
                }
                const authToken = jwt.sign(data, JWT_SECRET);
                res.json({ "Status": "Login Successfull", authToken: authToken });
            }
            else {
                res.status(401).json({ "Status": "The password you entered Does not match" });
            }
        }
        else {
            res.status(404).json({ "Status": "There is no such user with this email" });
        }
    }
    catch (error) {
        res.status(500).json({ "status": "Some error occured" });
        console.log(error);
    }
});

module.exports = router;