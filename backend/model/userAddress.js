const { DataTypes } = require("sequelize");
const { sequelize } = require("../db/database");

const UserAddress = sequelize.define(
  "UserAddress",
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
    addressLine1: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [5, 200]
      }
    },
    addressLine2: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: [0, 200]
      }
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [2, 100]
      }
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [2, 100]
      }
    },
    postalCode: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: [0, 20]
      }
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Nepal',
      validate: {
        len: [2, 100]
      }
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        is: /^[0-9+\-\s()]+$/
      }
    },
    isDefault: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    addressType: {
      type: DataTypes.ENUM('home', 'work', 'other'),
      defaultValue: 'home'
    }
  },
  {
    tableName: "user_addresses",
    timestamps: true,
    indexes: [
      {
        fields: ['userId']
      },
      {
        fields: ['isDefault']
      }
    ]
  }
);

// Instance method to get full address
UserAddress.prototype.getFullAddress = function() {
  let address = this.addressLine1;
  if (this.addressLine2) {
    address += `, ${this.addressLine2}`;
  }
  address += `, ${this.city}, ${this.state}`;
  if (this.postalCode) {
    address += ` ${this.postalCode}`;
  }
  address += `, ${this.country}`;
  return address;
};

module.exports = UserAddress; 