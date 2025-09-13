const express = require("express");
const AnnouncementController = require("../controller/announcementController");
const auth = require("../auth/index");

const { authenticateToken, adminAuthorisation } = auth;

const announcementRouter = express.Router();

// ✅ Admin routes (protected)
announcementRouter.post(
  "/create-or-update",
  authenticateToken,
  adminAuthorisation,
  AnnouncementController.updateAnnouncement
);

announcementRouter.patch(
  "/toggle",
  authenticateToken,
  adminAuthorisation,
  AnnouncementController.toggleAnnouncement
);

// ✅ Admin: Fetch all announcements (protected)
announcementRouter.get(
  "/all",
  authenticateToken,
  adminAuthorisation,
  AnnouncementController.getAllAnnouncements
);

// ✅ Public route: Get latest active announcement
announcementRouter.get(
  "/get-latest",
  AnnouncementController.getAnnouncement
);

module.exports = announcementRouter;
