const router = require("express").Router();

const homeRoutes = require("./homeController");
const savedEventRoutes = require("./savedEventController");
const searchEventRoutes = require("./searchEventController");
const authRoutes = require("./authController");
const geolocationRoutes = require("./geolocationController");

router.use("/", homeRoutes);
router.use("/saved-events", savedEventRoutes);
router.use("/search-events", searchEventRoutes);
router.use("/auth", authRoutes);
router.use("/api", geolocationRoutes);

module.exports = router;
