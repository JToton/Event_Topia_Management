const User = require("./User");
const SavedEvent = require("./savedEvents");

User.hasMany(SavedEvent, {
  foreignKey: "userId",
  onDelete: "CASCADE",
});

SavedEvent.belongsTo(User, {
  foreignKey: "userId",
});

module.exports = { User, SavedEvent };
