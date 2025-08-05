const { DataTypes } = require("sequelize");
const { sequelize } = require("../db/database");

const Review = sequelize.define(
  "Review",
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
      }
    },
    heritageId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Heritages",
        key: "id"
      }
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5
      }
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [5, 100]
      }
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        len: [10, 1000]
      }
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  },
  {
    tableName: "reviews",
    timestamps: true,
    indexes: [
      {
        fields: ['heritageId']
      },
      {
        fields: ['userId']
      },
      {
        fields: ['rating']
      },
      {
        fields: ['isActive']
      },
      {
        unique: true,
        fields: ['userId', 'heritageId']
      }
    ]
  }
);

module.exports = Review; 