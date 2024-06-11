const router = require("express").Router();
const axios = require("axios");
const authMiddleware = require("../utils/authMiddleware");

router.get("/", authMiddleware, (req, res) => {
  //! added for debugging
  console.log("Search route handler triggered");
  res.render("searchEvents", { loggedIn: req.session.logged_in });
});

router.post("/search", authMiddleware, async (req, res) => {
  try {
    const { keyword, startDate, endDate, city, stateCode, postalCode } =
      req.body;

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
          size: 20,
        },
      }
    );

    const events = data._embedded.events.map((event) => ({
      id: event.id,
      name: event.name,
      date: event.dates.start.localDate,
      url: event.url,
      images: event.images,
    }));

    res.render("searchEvents", { events, loggedIn: req.session.logged_in });
  } catch (err) {
    console.error(err);
    res.status(500).render("searchEvents", {
      error: "An error occurred",
      loggedIn: req.session.logged_in,
    });
  }
});

module.exports = router;
