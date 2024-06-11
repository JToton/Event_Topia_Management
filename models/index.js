const User = require("./User");
const SavedEvent = require("./savedEvents");

// *Define a one-to-many relationship between User and SavedEvent.
User.hasMany(SavedEvent, {
  // *Set the foreign key in the SavedEvent table to reference the User table.
  foreignKey: "userId",
  // *If a User is deleted, delete all associated SavedEvents.
  onDelete: "CASCADE",
});

// *Define a many-to-one relationship between SavedEvent and User.
SavedEvent.belongsTo(User, {
  // *Set the foreign key in the SavedEvent table to reference the User table.
  foreignKey: "userId",
});

module.exports = { User, SavedEvent };
