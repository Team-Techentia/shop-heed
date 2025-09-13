const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

// 🔹 Cloudinary Config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ Upload Single Image
const singleImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const result = await new Promise((resolve, reject) => {
      const cldStream = cloudinary.uploader.upload_stream(
        {
          folder: "profile_pics",
          transformation: [{ height: 1000, crop: "scale" }],
        },
        (error, result) => (error ? reject(error) : resolve(result))
      );
      streamifier.createReadStream(req.file.buffer).pipe(cldStream);
    });

    res.status(200).json({ imageUrl: result.secure_url, publicId: result.public_id });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// ✅ Upload Multiple Images
const uploadBulkImage = async (req, res) => {
  try {
    if (!req.files?.length) return res.status(400).json({ error: "No files uploaded" });

    const uploadPromises = req.files.map(
      (file) =>
        new Promise((resolve, reject) => {
          const cldStream = cloudinary.uploader.upload_stream(
            {
              folder: "bulk_uploads",
              transformation: [{ height: 1000, crop: "scale" }],
            },
            (error, result) => (error ? reject(error) : resolve(result.secure_url))
          );
          streamifier.createReadStream(file.buffer).pipe(cldStream);
        })
    );

    const imageUrls = await Promise.all(uploadPromises);
    res.status(200).json({ imageUrls });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// ✅ Delete Image
const deleteImage = async (req, res) => {
  try {
    let { publicId } = req.params;

    if (!publicId) return res.status(400).json({ error: "Public ID is required" });

    const result = await cloudinary.uploader.destroy(publicId);
    res.status(200).json({ message: "Image deleted", result });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { singleImage, uploadBulkImage, deleteImage };
