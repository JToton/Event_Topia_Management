const router = require("express").Router();
const authMiddleware = require("../utils/authMiddleware");
const { SavedEvent } = require("../models");

// *Route to GET all saved events for the logged-in user.
router.get("/", authMiddleware, async (req, res) => {
  // ! Debugging log.
  console.log("Saved Events route handler triggered");
  try {
    // *Fetch all saved events for the current user from the database.
    const savedEvents = await SavedEvent.findAll({
      where: { user_id: req.session.userId },
      attributes: [
        "event_id",
        "event_name",
        "event_date",
        "event_time",
        "event_venue",
        "event_url",
        "event_image_url",
      ],
    });
    // ! Debugging log.
    console.log("Saved Events:", savedEvents);

    // *Render the savedEvents page with the fetched events and login status.
    res.render("savedEvents", { savedEvents, loggedIn: req.session.logged_in });
  } catch (err) {
    // *Log the error and render the savedEvents page with an error message.
    console.error(err);
    res.status(500).render("savedEvents", {
      error: "An error occurred",
      loggedIn: req.session.logged_in,
    });
  }
});

// *Route to POST (remove) a saved event for the logged-in user.
router.post("/remove-event", authMiddleware, async (req, res) => {
  try {
    const { eventId } = req.body;

    // ! Debugging log.
    console.log("Removing event with ID:", eventId);

    // *Delete the specified saved event for the current user from the database.
    await SavedEvent.destroy({
      where: {
        user_id: req.session.userId,
        event_id: eventId,
      },
    });

    // *Respond with status 200 (OK) on success.
    res.sendStatus(200);
  } catch (err) {
    // *Log the error and respond with status 500 (Internal Server Error).
    console.error(err);
    res.sendStatus(500);
  }
});

module.exports = router;
