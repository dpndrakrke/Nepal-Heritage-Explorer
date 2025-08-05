const { DataTypes } = require("sequelize");
const { sequelize } = require("../db/database");

const Image = sequelize.define(
  "Image",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    filename: {
      type: DataTypes.STRING,
      allowNull: false
    },
    originalName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    path: {
      type: DataTypes.STRING,
      allowNull: false
    },
    size: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    mimeType: {
      type: DataTypes.STRING,
      allowNull: true
    },
    isPrimary: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    caption: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: [0, 200]
      }
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
    uploadedBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Users",
        key: "id"
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE"
    }
  },
  {
    tableName: "images",
    timestamps: true,
    indexes: [
      {
        fields: ['heritageId']
      },
      {
        fields: ['uploadedBy']
      },
      {
        fields: ['isPrimary']
      }
    ]
  }
);

// Instance method to get full URL
Image.prototype.getFullUrl = function() {
  return `${process.env.BACKEND_URL || 'http://localhost:5000'}/uploads/${this.filename}`;
};

// Instance method to get thumbnail URL
Image.prototype.getThumbnailUrl = function() {
  const nameWithoutExt = this.filename.replace(/\.[^/.]+$/, "");
  return `${process.env.BACKEND_URL || 'http://localhost:5000'}/uploads/thumbnails/${nameWithoutExt}_thumb.jpg`;
};

// Define relationships
const Heritage = require("./heritage");
const User = require("./user");

Heritage.hasMany(Image, { foreignKey: "heritageId" });
Image.belongsTo(Heritage, { foreignKey: "heritageId" });

User.hasMany(Image, { foreignKey: "uploadedBy" });
Image.belongsTo(User, { foreignKey: "uploadedBy" });

module.exports = Image; 