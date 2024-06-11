const router = require("express").Router();

router.post("/api/geolocation", (req, res) => {
  const { latitude, longitude } = req.body;
  req.session.latitude = latitude;
  req.session.longitude = longitude;
  res.sendStatus(200);
});

module.exports = router;
