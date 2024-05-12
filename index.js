// app.js
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cors = require('cors')

const videoRoutes = require("./routes/videoRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const loginRoutes = require("./routes/loginRoutes");
const vw = require('./controllers/watchvideo');


const checkAuth = require('./middlewares/auth')

const app = express();

app.use(express.json());

mongoose.connect(
  "mongodb+srv://prem1232:prem1232@cluster0.spi5j.mongodb.net/cloven?retryWrites=true&w=majority"
);

// Routes
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.get("/", (req, res) => {
  res.send({ message: "api is working fine" });
});

app.use("/api/auth",loginRoutes)
app.use("/api/categories", checkAuth, categoryRoutes);
app.get("/api/videos/:videoId",vw.watchVideo);
app.use("/api/videos", checkAuth, videoRoutes);
app.use(
  "/uploads/videos",
  checkAuth,
  express.static(path.join(__dirname, "./uploads"))
);

app.use("*", (req, res) => {
  console.log(req.originalUrl)
  res.status(404).json({ error: "url not found" })
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
