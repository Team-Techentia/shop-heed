const fs = require("fs");
const path = require("path");
const sharp = require('sharp'); 
const host = "https://shopheed.com/"


const singleImage = async function (req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const imageData = req.file.buffer; 
    const filename = `profile_pic_${Date.now()}.jpg`; 
    const uploadDirectory = path.join(__dirname, '../../../uploadImages/images');
    
    
    if (!fs.existsSync(uploadDirectory)) {
      fs.mkdirSync(uploadDirectory);
    }

    const imagePath = path.join(uploadDirectory, filename); 

  
    await sharp(imageData)
      .resize({height:1000})
      .jpeg({ quality: 80 })
      .toFile(imagePath); 

   
    const imageUrl = `${host}/static/images/${filename}`;

   
    res.status(200).json({ imageUrl });
  } catch (error) {

    res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteImage = async function (req, res) {
  try {
    const filename = req.params.filename; 
    if (!filename) {
      return res.status(400).json({ error: "Filename is required" });
    }

    const uploadDirectory = path.join(__dirname, "../../../uploadImages/images");
    const imagePath = path.join(uploadDirectory, filename);

    if (!fs.existsSync(imagePath)) {
      return res.status(404).json({ error: "File not found" });
    }

    fs.unlinkSync(imagePath);

    res.status(200).json({ message: "Image deleted successfully" });
  } catch (error) {
  
    res.status(500).json({ error: "Internal server error" });
  }
};

   const uploadBulkImage =    async (req, res) => {
    
 
};






  module.exports = { singleImage ,deleteImage ,uploadBulkImage };
