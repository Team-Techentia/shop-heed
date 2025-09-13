const Announcement = require("../Model/Announcement");

class AnnouncementController {
  // ✅ Get the latest active announcement
  async getAnnouncement(req, res) {
    try {
      let announcement = await Announcement.findOne({ isActive: true })
        .sort({ updatedAt: -1 })
        .lean();

      if (!announcement) {
        const newAnnouncement = new Announcement({
          text: "Welcome to our website!",
          isActive: true,
        });
        announcement = await newAnnouncement.save();
      }

      res.status(200).json({
        success: true,
        data: {
          text: announcement.text,
          isActive: announcement.isActive,
          updatedAt: announcement.updatedAt,
        },
      });
    } catch (error) {
      console.error("Error fetching announcement:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch announcement",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  // ✅ Fetch all announcements
  async getAllAnnouncements(req, res) {
    try {
      const announcements = await Announcement.find({})
        .sort({ updatedAt: -1 })
        .lean();

      res.status(200).json({
        success: true,
        count: announcements.length,
        data: announcements.map((a) => ({
          text: a.text,
          isActive: a.isActive,
          updatedAt: a.updatedAt,
        })),
      });
    } catch (error) {
      console.error("Error fetching all announcements:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch announcements",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  // ✅ Update or create announcement
  async updateAnnouncement(req, res) {
    try {
      const { text, isActive = true } = req.body;

      if (!text?.trim()) {
        res.status(400).json({
          success: false,
          message: "Announcement text is required",
        });
        return;
      }

      if (text.length > 500) {
        res.status(400).json({
          success: false,
          message: "Announcement text must be less than 500 characters",
        });
        return;
      }

      let announcement = await Announcement.findOne({ isActive: true });

      if (announcement) {
        announcement.text = text.trim();
        announcement.isActive = isActive;
        announcement.updatedAt = new Date();
        await announcement.save();
      } else {
        announcement = new Announcement({
          text: text.trim(),
          isActive,
        });
        await announcement.save();
      }

      res.status(200).json({
        success: true,
        message: "Announcement updated successfully",
        data: {
          text: announcement.text,
          isActive: announcement.isActive,
          updatedAt: announcement.updatedAt,
        },
      });
    } catch (error) {
      console.error("Error updating announcement:", error);
      res.status(500).json({
        success: false,
        message: "Failed to update announcement",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  // ✅ Toggle announcement active/inactive
  async toggleAnnouncement(req, res) {
    try {
      const announcement = await Announcement.findOne();

      if (!announcement) {
        res.status(404).json({
          success: false,
          message: "No active announcement found",
        });
        return;
      }

      announcement.isActive = !announcement.isActive;
      announcement.updatedAt = new Date();
      await announcement.save();

      res.status(200).json({
        success: true,
        message: `Announcement ${
          announcement.isActive ? "activated" : "deactivated"
        }`,
        data: {
          text: announcement.text,
          isActive: announcement.isActive,
          updatedAt: announcement.updatedAt,
        },
      });
    } catch (error) {
      console.error("Error toggling announcement:", error);
      res.status(500).json({
        success: false,
        message: "Failed to toggle announcement",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
}

module.exports = new AnnouncementController();
