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
          apikey: "AVDgVcvKelwg39PSEXIBgvRlF45Qv88g",
          city: "Salt Lake City",
          stateCode: "UT",
          radius: "20",
          unit: "miles",
          sort: "date,asc",
        },
      }
    );

    const events = response.data._embedded.events.map((event) => ({
      id: event.id,
      name: event.name,
      url: event.url,
      startDate: event.dates.start.localDate,
      startTime: event.dates.start.localTime,
      venue: event._embedded.venues[0].name,
    }));

    res.render("home", {
      events,
      loggedIn: req.session.loggedIn,
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
      eventStartDate,
      eventStartTime,
      eventUrl,
      eventVenue,
    } = req.body;
    const userId = req.session.userId;

    console.log("User ID:", userId);

    // Check if the event is already saved by the user
    const existingEvent = await Event.findOne({
      where: { id: eventId, userId: userId },
    });

    if (existingEvent) {
      return res.status(400).json({ message: "Event already saved" });
    }

    // Save the event with the associated user ID and all required fields
    await Event.create({
      id: eventId,
      name: eventName,
      startDate: eventStartDate,
      startTime: eventStartTime,
      url: eventUrl,
      venue: eventVenue,
      userId: userId,
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
          apikey: "AVDgVcvKelwg39PSEXIBgvRlF45Qv88g",
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

    res.render("event", { event, loggedIn: req.session.loggedIn });
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

  res.render("login");
});

module.exports = router;
