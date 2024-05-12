// middlewares/upload.js
const multer = require('multer');
const fs = require('fs').promises;
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const fileName = new Date().toISOString() + '-' + file.originalname;
    cb(null, fileName);
  },
});

const fileFilter = (req, file, cb) => {
  // Accept only video files
  if (file.mimetype.startsWith('video/')) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only video files are allowed.'), false);
  }
};

const upload = multer({ 
  storage: storage, 
  fileFilter: fileFilter 
});

const uploadMiddleware = (req, res, next) => {
  upload.single('video')(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ error: err.message });
    } else if (err) {
      return res.status(500).json({ error: 'An error occurred while uploading the file.' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded.' });
    }

    try {
      const uploadedFileName = new Date().toISOString() + '-' + req.file.originalname;
      const uploadedFilePath = path.join(__dirname, '..', 'uploads', uploadedFileName);
      
      await fs.rename(req.file.path, uploadedFilePath);

      req.uploadedFileName = uploadedFileName;

      next();
    } catch (error) {
      await fs.unlink(req.file.path);
      return res.status(500).json({ error: 'An error occurred while processing the file.' });
    }
  });
};

module.exports = uploadMiddleware;
