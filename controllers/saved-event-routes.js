const router = require("express").Router();
const { User, Event } = require("../models");
const withAuth = require("../utils/auth");

router.get("/", withAuth, async (req, res) => {
  try {
    const userId = req.session.userId;

    // Fetch the user's saved events
    const userData = await User.findByPk(userId, {
      include: [{ model: Event }],
    });

    const savedEvents = userData.Events.map((event) =>
      event.get({ plain: true })
    );

    res.render("saved-events", {
      savedEvents,
      loggedIn: req.session.loggedIn,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
