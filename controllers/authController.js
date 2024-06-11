const router = require("express").Router();
const bcrypt = require("bcrypt");
const { User } = require("../models");

router.get("/login", (req, res) => {
  res.render("login");
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res
        .status(400)
        .render("login", { error: "Invalid email or password" });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res
        .status(400)
        .render("login", { error: "Invalid email or password" });
    }

    req.session.user_id = user.id;
    req.session.logged_in = true;

    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.status(500).render("login", { error: "An error occurred" });
  }
});

router.get("/signup", (req, res) => {
  res.render("signup");
});

router.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    req.session.user_id = newUser.id;
    req.session.logged_in = true;

    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.status(500).render("signup", { error: "An error occurred" });
  }
});

router.post("/logout", (req, res) => {
  if (req.session.logged_in) {
    req.session.destroy(() => {
      res.redirect("/");
    });
  } else {
    res.status(404).end();
  }
});

module.exports = router;
