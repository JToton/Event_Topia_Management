const User = require("./User");
const Event = require("./events");

User.hasMany(Event, {
  foreignKey: "userId",
  onDelete: "CASCADE",
});

Event.belongsTo(User, {
  foreignKey: "userId",
});

module.exports = { User, Event };
