const { DataTypes } = require("sequelize");
const { sequelize } = require("../db/database");

const SavedHeritage = sequelize.define(
  "SavedHeritage",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Users",
        key: "id"
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE"
    },
    heritageId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Heritages",
        key: "id"
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE"
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 1,
        max: 5
      }
    }
  },
  {
    tableName: "saved_heritages",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['userId', 'heritageId']
      },
      {
        fields: ['userId']
      },
      {
        fields: ['heritageId']
      }
    ]
  }
);

// Instance method to get rating stars
SavedHeritage.prototype.getRatingStars = function() {
  if (!this.rating) return '';
  return '★'.repeat(this.rating) + '☆'.repeat(5 - this.rating);
};

// Define relationships
const User = require("./user");
const Heritage = require("./heritage");

User.hasMany(SavedHeritage, { foreignKey: "userId" });
SavedHeritage.belongsTo(User, { foreignKey: "userId" });

Heritage.hasMany(SavedHeritage, { foreignKey: "heritageId" });
SavedHeritage.belongsTo(Heritage, { foreignKey: "heritageId" });

module.exports = SavedHeritage; 