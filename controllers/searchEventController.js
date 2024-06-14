const router = require("express").Router();
const axios = require("axios");
const authMiddleware = require("../utils/authMiddleware");

// Route to render the search events page
router.get("/", authMiddleware, (req, res) => {
  console.log("Search route handler triggered");
  res.render("searchEvents", { loggedIn: req.session.logged_in });
});

// Route to handle event search based on user input
router.post("/search", authMiddleware, async (req, res) => {
  try {
    // Destructure search parameters from request body
    const { keyword, startDate, endDate, city, stateCode, postalCode } = req.body;

    // Make request to Ticketmaster Discovery API with search parameters
    const response = await axios.get("https://app.ticketmaster.com/discovery/v2/events.json", {
      params: {
        apikey: process.env.TICKETMASTER_API_KEY,
        keyword,
        startDateTime: startDate,
        endDateTime: endDate,
        city,
        stateCode,
        postalCode,
        size: 20, // Limit results to 20
      },
    });

    // Extract relevant event information from response data
    const events = response.data._embedded.events.map((event) => ({
      id: event.id,
      name: event.name,
      date: event.dates.start.localDate,
      url: event.url,
      images: event.images,
    }));

    // Render the searchEvents page with search results and login status
    res.render("searchEvents", { events, loggedIn: req.session.logged_in });
  } catch (error) {
    // Log detailed error information for debugging
    console.error("Error fetching events from Ticketmaster API:", error);

    // Render searchEvents page with an error message
    res.status(500).render("searchEvents", {
      error: "An error occurred while fetching events. Please try again later.",
      loggedIn: req.session.logged_in,
    });
  }
});

module.exports = router;
