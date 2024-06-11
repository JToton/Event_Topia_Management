const router = require("express").Router();
const authMiddleware = require("../utils/authMiddleware");
const { SavedEvent } = require("../models");

router.get("/", authMiddleware, async (req, res) => {
  //! added for debugging
  console.log("Saved Events route handler triggered");
  try {
    const savedEvents = await SavedEvent.findAll({
      where: { user_id: req.session.user_id },
    });

    res.render("savedEvents", { savedEvents, loggedIn: req.session.logged_in });
  } catch (err) {
    console.error(err);
    res.status(500).render("savedEvents", {
      error: "An error occurred",
      loggedIn: req.session.logged_in,
    });
  }
});

router.post("/remove-event", authMiddleware, async (req, res) => {
  try {
    const { eventId } = req.body;

    await SavedEvent.destroy({
      where: {
        user_id: req.session.user_id,
        event_id: eventId,
      },
    });

    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

module.exports = router;
