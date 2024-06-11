const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection");

class SavedEvent extends Model {}

SavedEvent.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "user",
        key: "id",
      },
    },
    event_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    event_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    event_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    event_time: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    event_venue: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    event_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    event_image_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    timestamps: true,
    underscored: true,
    modelName: "saved_event",
  }
);

module.exports = SavedEvent;
