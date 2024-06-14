const router = require("express").Router();
const authMiddleware = require("../utils/authMiddleware");
const { Event, SavedEvent } = require("../models");
const axios = require('axios');

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

// Function to fetch event ID and make API call
const fetchEventAndMakeApiCall = async (eventId) => {
  try {
      // Fetch the event from the database
      const event = await Event.findByPk(eventId);

      if (!event) {
          console.error('Event not found');
          return;
      }

      // Make an API call using the event ID
      const response = await axios.get(`https://api.example.com/events/${event.id}`);
      
      // Handle the response
      console.log(response.data);

  } catch (error) {
      console.error('Error fetching event or making API call:', error);
  }
};

// Function to fetch all saved events for the current user
const fetchSavedEventsForUser = async (userId) => {
  try {
      const savedEvents = await SavedEvent.findAll({
          where: { user_id: userId },
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

      // Iterate over saved events and make API calls
      for (const savedEvent of savedEvents) {
          await fetchEventAndMakeApiCall(savedEvent.event_id);
      }

      return savedEvents;
  } catch (error) {
      console.error('Error fetching saved events:', error);
  }
};

module.exports = router;
