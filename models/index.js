const User = require("./User");
const Event = require("./savedEvents");

User.hasMany(Event, {
  foreignKey: "userId",
  onDelete: "CASCADE",
});

Event.belongsTo(User, {
  foreignKey: "userId",
});

module.exports = { User, Event };
