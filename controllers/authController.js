// *Import the Express router, bcrypt for password hashing, and the user model.
const router = require("express").Router();
const { hashPassword, verifyPassword } = require("../utils/crypt/bcrypt_utils");
const { User } = require("../models");

// Route for rendering the login page.
router.get("/login", (req, res) => {
    res.render("login");
});

// Route for handling login form submission.
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find a user with the provided email.
        const user = await User.findOne({ where: { email } });

        // If no user is found, render login page with error message.
        if (!user) {
            return res.status(400).render("login", { error: "Invalid email or password" });
        }

        // Compare the provided password with the stored hashed password.
        const validPassword = await verifyPassword(password, user.password);

        // If the password is invalid, render login page with error message.
        if (!validPassword) {
            return res.status(400).render("login", { error: "Invalid email or password" });
        }

        // Set session variables to indicate the user is logged in.
        req.session.logged_in = true;
        req.session.user = {
            id: user.id,
            username: user.username,
        };
        req.session.userId = user.id;

        // Redirect to the homepage after successful login.
        res.redirect("/");
    } catch (err) {
        console.error(err);
        res.status(500).render("login", { error: "An error occurred" });
    }
});

// Route for rendering the signup page.
router.get("/signup", (req, res) => {
    res.render("signup");
});

// Route for handling signup form submission.
router.post("/signup", async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Hash the provided password.
        const hashedPassword = await hashPassword(password);

        // Create a new user with the provided details and hashed password.
        const newUser = await User.create({
            username,
            email,
            password: hashedPassword,
        });

        req.session.logged_in = true;
        req.session.user = {
            id: newUser.id,
            username: newUser.username,
        };
        req.session.userId = newUser.id;

        // Redirect to the homepage after successful signup.
        res.redirect("/");
    } catch (err) {
        console.error(err);
        res.status(500).render("signup", { error: "An error occurred" });
    }
});

// Route for handling logout.
router.post("/logout", (req, res) => {
    // If the user is logged in, destroy the session and redirect to the homepage.
    if (req.session.logged_in) {
        req.session.destroy(() => {
            res.redirect("/");
        });
    } else {
        // If no user is logged in, respond with a 404 status.
        res.status(404).end();
    }
});

module.exports = router;
