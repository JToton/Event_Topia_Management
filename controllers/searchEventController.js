const router = require("express").Router();
const axios = require("axios");
const authMiddleware = require("../utils/authMiddleware");

// *Route to render the search events page.
router.get("/", authMiddleware, (req, res) => {
  console.log("Search route handler triggered"); // Debugging log
  res.render("searchEvents", { loggedIn: req.session.logged_in });
});

// *Route to handle event search based on user input.
router.post("/search", authMiddleware, async (req, res) => {
  try {
    const { keyword, startDate, endDate, city, stateCode, postalCode } =
      req.body;

    // *Make a request to the Ticketmaster Discovery API with the search parameters.
    const { data } = await axios.get(
      "https://app.ticketmaster.com/discovery/v2/events.json",
      {
        params: {
          apikey: process.env.TICKETMASTER_API_KEY,
          keyword,
          startDateTime: startDate,
          endDateTime: endDate,
          city,
          stateCode,
          postalCode,
          // *Limit the number of results to 20.
          size: 20,
        },
      }
    );

    // *Map the response data to extract relevant event information.
    const events = data._embedded.events.map((event) => ({
      id: event.id,
      name: event.name,
      date: event.dates.start.localDate,
      url: event.url,
      images: event.images,
    }));

    // *Render the searchEvents page with the search results and login status.
    res.render("searchEvents", { events, loggedIn: req.session.logged_in });
  } catch (err) {
    // *Log the error and render the searchEvents page with an error message.
    console.error(err);
    res.status(500).render("searchEvents", {
      error: "An error occurred",
      loggedIn: req.session.logged_in,
    });
  }
});

module.exports = router;
