const { DataTypes } = require("sequelize");
const { sequelize } = require("../db/database");

const Heritage = sequelize.define(
  "Heritage",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [2, 200]
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    shortDescription: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: [0, 500]
      }
    },
    longDescription: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [2, 200]
      }
    },
    category: {
      type: DataTypes.ENUM('temple', 'palace', 'monument', 'museum', 'natural', 'fortress', 'monastery', 'other'),
      defaultValue: 'other'
    },
    historicalPeriod: {
      type: DataTypes.STRING,
      allowNull: true
    },
    builtYear: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 1000,
        max: new Date().getFullYear(),
        isInt: {
          msg: 'Built year must be a valid integer'
        }
      }
    },
    architect: {
      type: DataTypes.STRING,
      allowNull: true
    },
    significance: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    visitingHours: {
      type: DataTypes.STRING,
      allowNull: true
    },
    openingHours: {
      type: DataTypes.STRING,
      allowNull: true
    },
    entryFee: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: 0.00,
      validate: {
        min: 0
      }
    },
    accessibility: {
      type: DataTypes.STRING,
      allowNull: true
    },
    latitude: {
      type: DataTypes.DECIMAL(10, 8),
      allowNull: true,
      validate: {
        min: -90,
        max: 90
      }
    },
    longitude: {
      type: DataTypes.DECIMAL(11, 8),
      allowNull: true,
      validate: {
        min: -180,
        max: 180
      }
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    featured: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Users",
        key: "id"
      }
    }
  },
  {
    tableName: "heritages",
    timestamps: true,
    indexes: [
      {
        fields: ['name']
      },
      {
        fields: ['location']
      },
      {
        fields: ['category']
      },
      {
        fields: ['isActive']
      },
      {
        fields: ['featured']
      },
      {
        fields: ['createdBy']
      }
    ]
  }
);

// Instance method to get formatted entry fee
Heritage.prototype.getFormattedEntryFee = function() {
  return this.entryFee ? `Rs. ${this.entryFee}` : 'Free';
};

// Instance method to get coordinates
Heritage.prototype.getCoordinates = function() {
  if (this.latitude && this.longitude) {
    return { lat: this.latitude, lng: this.longitude };
  }
  return null;
};

module.exports = Heritage; 