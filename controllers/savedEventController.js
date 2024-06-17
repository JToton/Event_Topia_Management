const router = require("express").Router();
const authMiddleware = require("../utils/authMiddleware");
const { SavedEvent } = require("../models");
const axios = require("axios");

// Route to GET all saved events for the logged-in user
router.get("/", authMiddleware, async (req, res) => {
  console.log("Saved Events route handler triggered");
  try {
    const savedEvents = await fetchSavedEventsForUser(req.session.userId);
    console.log("Saved Events:", savedEvents);
    res.render("savedEvents", { savedEvents, loggedIn: req.session.logged_in });
  } catch (err) {
    console.error(err);
    res.status(500).render("savedEvents", {
      error: "An error occurred",
      loggedIn: req.session.logged_in,
    });
  }
});

// Route to POST (remove) a saved event for the logged-in user
router.post("/remove-event", authMiddleware, async (req, res) => {
  try {
    const { eventId } = req.body;
    console.log("Removing event with ID:", eventId);

    // Delete the specified saved event for the current user from the database
    await SavedEvent.destroy({
      where: {
        user_id: req.session.userId,
        event_id: eventId,
      },
    });

    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

// Function to fetch event details from Ticketmaster Discovery API
const fetchEventDetails = async (eventId) => {
  try {
    const response = await axios.get(
      `https://app.ticketmaster.com/discovery/v2/events/${eventId}.json`,
      {
        params: {
          apikey: process.env.TICKETMASTER_API_KEY,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching event details:", error);
    return null;
  }
};

// Function to fetch all saved events for the current user
const fetchSavedEventsForUser = async (userId) => {
  try {
    const savedEvents = await SavedEvent.findAll({
      where: { user_id: userId },
      attributes: ["event_id"],
    });

    const eventPromises = savedEvents.map(async (savedEvent) => {
      const eventDetails = await fetchEventDetails(savedEvent.event_id);

      if (eventDetails) {
        return {
          id: eventDetails.id,
          name: eventDetails.name,
          date: eventDetails.dates.start.localDate,
          time: eventDetails.dates.start.localTime,
          venue: eventDetails._embedded.venues[0].name,
          url: eventDetails.url,
          imageUrl: eventDetails.images[0].url,
        };
      }

      return null;
    });

    const events = await Promise.all(eventPromises);
    return events.filter((event) => event !== null);
  } catch (error) {
    console.error("Error fetching saved events:", error);
    return [];
  }
};

module.exports = router;
