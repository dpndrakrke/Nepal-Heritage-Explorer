const { DataTypes } = require("sequelize");
const { sequelize } = require("../db/database");

const Comment = sequelize.define(
  "Comment",
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
    parentId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "Comments",
        key: "id"
      }
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        len: [1, 500]
      }
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  },
  {
    tableName: "comments",
    timestamps: true,
    indexes: [
      {
        fields: ['heritageId']
      },
      {
        fields: ['userId']
      },
      {
        fields: ['parentId']
      },
      {
        fields: ['isActive']
      }
    ]
  }
);

module.exports = Comment; 