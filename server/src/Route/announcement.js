const express = require("express");
const AnnouncementController = require("../controller/announcementController");
const auth = require("../auth/index");

const { authenticateToken, adminAuthorisation } = auth;

const announcementRouter = express.Router();

// ✅ Admin routes (protected)
announcementRouter.post(
  "/create-or-update",
  AnnouncementController.updateAnnouncement
);

announcementRouter.patch(
  "/toggle",
  AnnouncementController.toggleAnnouncement
);

// ✅ Admin: Fetch all announcements (protected)
announcementRouter.get(
  "/all",
  AnnouncementController.getAllAnnouncements
);

// ✅ Public route: Get latest active announcement
announcementRouter.get(
  "/get-latest",
  AnnouncementController.getAnnouncement
);

module.exports = announcementRouter;
