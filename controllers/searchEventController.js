const router = require("express").Router();
const axios = require("axios");
//const authMiddleware = require("../utils/authMiddleware");

// *Route to render the search events page.
router.get("/", (req, res) => {
  console.log("Search route handler triggered");
  res.render("searchEvents", { loggedIn: req.session.logged_in });
});

router.all("/search", async (req, res) => {
  try {
    const { keyword, startDate, endDate, city, stateCode } = req.query;
    const page = parseInt(req.query.page) || 1; // Get the current page from the query parameter or default to 1

    // *Make request to Ticketmaster Discovery API with search parameters.
    const response = await axios.get(
      "https://app.ticketmaster.com/discovery/v2/events.json",
      {
        params: {
          apikey: process.env.TICKETMASTER_API_KEY,
          keyword,
          startDateTime: startDate ? `${startDate}T00:00:00Z` : undefined,
          endDateTime: endDate ? `${endDate}T23:59:59Z` : undefined,
          city,
          stateCode,
          size: 20,
          page,
          sort: "date,asc",
        },
      }
    );

    // *Extract relevant event information from response data
    const events = response.data._embedded.events.map((event) => ({
      id: event.id,
      name: event.name,
      date: event.dates.start.localDate,
      url: event.url,
      images: event.images,
    }));

    // *Extract pagination information from the response.
    const { totalPages, totalElements } = response.data.page;

    // *Render the searchEvents page with search results, pagination info, login status, and query parameters.
    res.render("searchEvents", {
      events,
      currentPage: page,
      totalPages,
      totalElements,
      loggedIn: req.session.logged_in,
      keyword,
      startDate,
      endDate,
      city,
      stateCode,
    });
  } catch (error) {
    // *Log detailed error information for debugging.
    console.error("Error fetching events from Ticketmaster API:", error);

    // *Render searchEvents page with an error message.
    res.status(500).render("searchEvents", {
      error: "An error occurred while fetching events. Please try again later.",
      loggedIn: req.session.logged_in,
    });
  }
});

module.exports = router;
