const router = require("express").Router();
const axios = require("axios");
const authMiddleware = require("../utils/authMiddleware");
const helpers = require("../utils/helpers");
const { SavedEvent } = require("../models");

router.get("/", async (req, res) => {
  console.log("Home route handler triggered");

  try {
    let events = [];
    let savedEvents = [];

    if (req.session.userId) {
      savedEvents = await SavedEvent.findAll({
        where: { user_id: req.session.userId },
      });
    }

    res.render("home", {
      headerClasses: "canScroll",
      events,
      savedEvents,
      loggedIn: req.session.logged_in,
      noEvents: events.length === 0,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.post("/events", async (req, res) => {
  try {
    const { latitude, longitude } = req.body;

    const response = await axios.get(
      "https://app.ticketmaster.com/discovery/v2/events.json",
      {
        params: {
          apikey: process.env.TICKETMASTER_API_KEY,
          latlong: `${latitude},${longitude}`,
          radius: "20",
          unit: "miles",
          sort: "date,asc",
        },
      }
    );

    let events = [];

    if (response.data._embedded && response.data._embedded.events) {
      events = response.data._embedded.events.map((event) => {
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
          venue:
            event._embedded &&
            event._embedded.venues &&
            event._embedded.venues[0]
              ? event._embedded.venues[0].name
              : "Venue not available",
          imageUrl,
        };
      });
    }

    res.json({ events });
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// *Route to POST (save) an event for the logged-in user.
router.post("/save-event", authMiddleware, async (req, res) => {
  try {
    // *Destructure event details from the request body.
    const {
      eventId,
      eventName,
      eventDate,
      eventStartTime,
      eventUrl,
      eventVenue,
    } = req.body;
    // *Get the user ID from the session.
    const userId = req.session.userId;

    // ! Debugging statements to log the request body and user ID.
    console.log("Request Body:", req.body);
    console.log("User ID:", userId);

    // *Check if the event is already saved by the user.
    const existingEvent = await SavedEvent.findOne({
      where: { event_id: eventId, user_id: userId },
    });

    if (existingEvent) {
      // *If the event is already saved, respond with a 400 status code and message.
      return res.status(400).json({ message: "Event already saved" });
    }

    // *Save the new event with the associated user ID and details.
    await SavedEvent.create({
      user_id: userId,
      event_id: eventId,
      event_name: eventName,
      event_date: eventDate,
    });

    // *Respond with a success message.
    res.status(200).json({ message: "Event saved successfully" });
  } catch (err) {
    // *Log the error and respond with a 500 status code and message.
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// *Route to GET a single event by ID.
router.get("/event/:id", authMiddleware, async (req, res) => {
  try {
    // *Make a request to the Ticketmaster Discovery API to get details of a specific event.
    const response = await axios.get(
      `https://app.ticketmaster.com/discovery/v2/events/${req.params.id}.json`,
      {
        params: {
          apikey: process.env.TICKETMASTER_API_KEY,
        },
      }
    );

    // *Extract relevant event details from the API response.
    const event = {
      id: response.data.id,
      name: response.data.name,
      description: response.data.info,
      url: response.data.url,
      startDate: response.data.dates.start.localDate,
      startTime: response.data.dates.start.localTime,
      venue: response.data._embedded.venues[0].name,
    };

    // *Render the event page with the event details and login status.
    res.render("event", { event, loggedIn: req.session.logged_in });
  } catch (err) {
    // *Log the error and respond with a 500 status code.
    console.log(err);
    res.status(500).json(err);
  }
});

// *Route to GET the login page.
router.get("/login", (req, res) => {
  // *If the user is already logged in, redirect to the home page.
  if (req.session.loggedIn) {
    res.redirect("/");
    return;
  }

  // *Render the login page with login status.
  res.render("login", { loggedIn: req.session.logged_in });
});

module.exports = router;
