const bcrypt = require("bcrypt");

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find the user in the database
    const user = await User.findOne({ where: { username } });

    if (!user) {
      return res.render("login", { error: "Invalid username or password" });
    }

    // Compare the provided password with the hashed password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.render("login", { error: "Invalid username or password" });
    }

    // If the passwords match, create a session and redirect to the dashboard
    req.session.userId = user.id;
    req.session.username = user.username;
    req.session.loggedIn = true;
    return res.redirect("/dashboard");
  } catch (error) {
    console.error(error);
    return res.render("login", { error: "An error occurred" });
  }
};
