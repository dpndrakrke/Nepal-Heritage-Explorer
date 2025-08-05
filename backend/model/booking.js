const { DataTypes } = require("sequelize");
const { sequelize } = require("../db/database");

const Booking = sequelize.define(
  "Booking",
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
    heritageSiteId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Heritages",
        key: "id"
      }
    },
    status: {
      type: DataTypes.ENUM('pending', 'confirmed', 'cancelled', 'completed'),
      defaultValue: "pending"
    },
    visitDate: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isAfterNow(value) {
          if (new Date(value) <= new Date()) {
            throw new Error('Visit date must be in the future');
          }
        }
      }
    },
    numberOfPeople: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      validate: {
        min: 1,
        max: 50
      }
    },
    totalAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00
    },
    specialRequests: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    bookingNotes: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  },
  {
    tableName: "bookings",
    timestamps: true,
    indexes: [
      {
        fields: ['userId']
      },
      {
        fields: ['heritageSiteId']
      },
      {
        fields: ['status']
      },
      {
        fields: ['visitDate']
      }
    ]
  }
);

// Instance method to get formatted status
Booking.prototype.getFormattedStatus = function() {
  const statusMap = {
    'pending': 'Pending',
    'confirmed': 'Confirmed',
    'cancelled': 'Cancelled',
    'completed': 'Completed'
  };
  return statusMap[this.status] || this.status;
};

// Instance method to calculate total amount
Booking.prototype.calculateTotalAmount = function(entryFee) {
  return (entryFee || 0) * this.numberOfPeople;
};

module.exports = Booking; 