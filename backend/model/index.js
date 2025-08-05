const User = require("./user");
const Heritage = require("./heritage");
const Booking = require("./booking");
const UserAddress = require("./userAddress");
const Image = require("./image");
const SavedHeritage = require("./savedHeritage");
const Review = require("./review");
const Comment = require("./comment");

// User relationships
User.hasMany(Heritage, { foreignKey: "createdBy", as: "createdHeritages" });
Heritage.belongsTo(User, { foreignKey: "createdBy", as: "creator" });

User.hasMany(Booking, { foreignKey: "userId", as: "bookings" });
Booking.belongsTo(User, { foreignKey: "userId", as: "user" });

User.hasMany(UserAddress, { foreignKey: "userId", as: "addresses" });
UserAddress.belongsTo(User, { foreignKey: "userId", as: "user" });

User.hasMany(Image, { foreignKey: "uploadedBy", as: "uploadedImages" });
Image.belongsTo(User, { foreignKey: "uploadedBy", as: "uploader" });

User.hasMany(SavedHeritage, { foreignKey: "userId", as: "savedHeritages" });
SavedHeritage.belongsTo(User, { foreignKey: "userId", as: "user" });

User.hasMany(Review, { foreignKey: "userId", as: "reviews" });
Review.belongsTo(User, { foreignKey: "userId", as: "user" });

User.hasMany(Comment, { foreignKey: "userId", as: "comments" });
Comment.belongsTo(User, { foreignKey: "userId", as: "user" });

// Heritage relationships
Heritage.hasMany(Booking, { foreignKey: "heritageSiteId", as: "bookings" });
Booking.belongsTo(Heritage, { foreignKey: "heritageSiteId", as: "heritageSite" });

Heritage.hasMany(Image, { foreignKey: "heritageId", as: "images" });
Image.belongsTo(Heritage, { foreignKey: "heritageId", as: "heritage" });

Heritage.hasMany(SavedHeritage, { foreignKey: "heritageId", as: "savedByUsers" });
SavedHeritage.belongsTo(Heritage, { foreignKey: "heritageId", as: "heritage" });

Heritage.hasMany(Review, { foreignKey: "heritageId", as: "reviews" });
Review.belongsTo(Heritage, { foreignKey: "heritageId", as: "heritage" });

Heritage.hasMany(Comment, { foreignKey: "heritageId", as: "comments" });
Comment.belongsTo(Heritage, { foreignKey: "heritageId", as: "heritage" });

// Comment self-referencing relationship (for replies)
Comment.hasMany(Comment, { foreignKey: "parentId", as: "replies" });
Comment.belongsTo(Comment, { foreignKey: "parentId", as: "parent" });

module.exports = {
  User,
  Heritage,
  Booking,
  UserAddress,
  Image,
  SavedHeritage,
  Review,
  Comment
}; 