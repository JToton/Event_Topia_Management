const router = require("express").Router();
const axios = require("axios");
const authMiddleware = require("../utils/authMiddleware");
const helpers = require("../utils/helpers");
const { SavedEvent } = require("../models");

// GET all events in Salt Lake City from Ticketmaster Discovery API
router.get("/", async (req, res) => {
  //! added for debugging
  console.log("Home route handler triggered");
  try {
    const response = await axios.get(
      "https://app.ticketmaster.com/discovery/v2/events.json",
      {
        params: {
          apikey: process.env.TICKETMASTER_API_KEY,
          city: "Salt Lake City",
          stateCode: "UT",
          radius: "20",
          unit: "miles",
          sort: "date,asc",
        },
      }
    );

    const events = response.data._embedded.events.map((event) => {
      // Extract the first available image URL or use a placeholder
      const imageUrl =
        event.images && event.images.length > 0
          ? event.images[0].url
          : "placeholder-image-url";

      return {
        id: event.id,
        name: event.name,
        url: event.url,
        startDate: event.dates.start.localDate,
        startTime: event.dates.start.localTime,
        venue: event._embedded.venues[0].name,
        imageUrl, // Add the image URL to the event object
      };
    });

    let savedEvents = [];

    if (req.session.userId) {
      // Fetch the user's saved events only if userId exists in the session
      savedEvents = await SavedEvent.findAll({
        where: { user_id: req.session.userId },
      });
    }

    res.render("home", {
      events,
      savedEvents,
      loggedIn: req.session.logged_in,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.post("/save-event", authMiddleware, async (req, res) => {
  try {
    const {
      eventId,
      eventName,
      eventDate,
      eventStartTime,
      eventUrl,
      eventVenue,
    } = req.body;
    const userId = req.session.userId;

    // !Debugger Code
    console.log("Request Body:", req.body); // Add this line to check the request body
    console.log("User ID:", userId);

    // Check if the event is already saved by the user
    const existingEvent = await SavedEvent.findOne({
      where: { event_id: eventId, user_id: userId },
    });

    if (existingEvent) {
      return res.status(400).json({ message: "Event already saved" });
    }

    // Save the event with the associated user ID and all required fields
    await SavedEvent.create({
      user_id: userId,
      event_id: eventId,
      event_name: eventName,
      event_date: eventDate,
    });

    res.status(200).json({ message: "Event saved successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// GET one event
router.get("/event/:id", authMiddleware, async (req, res) => {
  try {
    const response = await axios.get(
      `https://app.ticketmaster.com/discovery/v2/events/${req.params.id}.json`,
      {
        params: {
          apikey: process.env.TICKETMASTER_API_KEY,
        },
      }
    );

    const event = {
      id: response.data.id,
      name: response.data.name,
      description: response.data.info,
      url: response.data.url,
      startDate: response.data.dates.start.localDate,
      startTime: response.data.dates.start.localTime,
      venue: response.data._embedded.venues[0].name,
    };

    res.render("event", { event, loggedIn: req.session.logged_in });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.get("/login", (req, res) => {
  if (req.session.loggedIn) {
    res.redirect("/");
    return;
  }

  res.render("login", { loggedIn: req.session.logged_in });
});

module.exports = router;
