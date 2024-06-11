const router = require("express").Router();

// *Handle POST request to /api/geolocation.
router.post("/api/geolocation", (req, res) => {
  const { latitude, longitude } = req.body;
  // *Store latitude and longitude in session.
  req.session.latitude = latitude;
  req.session.longitude = longitude;
  // *Respond with status 200 (OK).
  res.sendStatus(200);
});

module.exports = router;
