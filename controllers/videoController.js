const Video = require("../models/video");
const Category = require("../models/category");
const url = require("../config").url;

function isValidURL(url) {
  const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w.-]*)*\/?$/;
  return urlRegex.test(url);
}
exports.uploadVideo = async (req, res) => {
  try {
    const { name, description, thumbnailUrl, categoryId } = req.body;
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(400).json({ error: "Invalid category ID" });
    }
    // if (!isValidURL(thumbnailUrl)) {
    //   return res.status(400).json({ error: "Invalid Thumbnail url." });
    // }
    const video = new Video({
      name,
      description,
      thumbnailUrl,
      category: categoryId,
      videoUrl: req.uploadedFileName,
    });
    await video.save();
    res.status(201).json(video);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllVideos = async (req, res) => {
  try {
    const videos = await Video.find().populate("category");
    return res.status(200).json(videos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getVideoByCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const videos = await Video.find({ category: { _id: id } }).populate(
      "category"
    );
    return res.status(200).json(videos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
