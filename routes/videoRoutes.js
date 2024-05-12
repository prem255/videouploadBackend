// routes/videoRoutes.js
const express = require('express');
const router = express.Router();
const videoController = require('../controllers/videoController');
const vw = require('../controllers/watchvideo');
const upload = require('../middlewares/upload');

router.post('/', upload, videoController.uploadVideo);
router.get('/', videoController.getAllVideos);
router.get('/cat/:id', videoController.getVideoByCategory);

// router.get('/:videoId', vw.watchVideo);

module.exports = router;
