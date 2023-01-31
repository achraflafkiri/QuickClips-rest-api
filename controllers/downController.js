const ytdl = require("ytdl-core");
const fs = require("fs");
const { google } = require("googleapis");
const formidable = require("formidable");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");
const Video = require("../models/videoModel");
const os = require("os");
const userProfile = os.homedir();
console.log(userProfile);

// GET ALL VIDEOS
const getAllVideos = catchAsync(async (req, res, next) => {
  // GET DIRE
  const videos = await Video.find();
  if (!videos) return next(AppError(404, "Has not videos yet"));

  res.status(200).send({
    status: "success",
    videos,
  });
});

const getOneVideo = catchAsync(async (req, res, next) => {
  //
  const video = await Video.findOne({ videoId: req.params.videoId });
  if (!video) return next(new AppError(404, "Not video found"));

  res.status(200).send({
    status: "success",
    video,
  });
});

// const youtube = google.youtube({
//   version: "v3",
//   auth: "AIzaSyAWG8H16RV5KBGsTYo6Epype4Ro9UpGiNk",
// });

// const getVideoTitle = async (videoId) => {
//   const res = await youtube.videos.list({
//     part: "snippet",
//     id: videoId,
//   });

//   console.log("title...", res.data.items[0].snippet.title);

//   return res.data.items[0].snippet.title;
// };

// const downloadVideo = catchAsync(async (req, res, next) => {
//   const { url, directory } = req.body;

//   const videoId = url.split("=")[1];
//   const title = await getVideoTitle(videoId);
//   console.log("title***", title);

//   const desiredName = `${title}-${Date.now()}`;
//   const videoPath = `${userProfile}/Downloads/${desiredName}.mp4`;

//   if (!url) return next(new AppError(404, "Url is required"));

//   const video = ytdl(url, { filter: "audioandvideo" });

//   video.pipe(fs.createWriteStream(videoPath));

//   ytdl.getInfo(url, (err, info) => {
//     if (err) throw err;
//     const format = ytdl.filterFormats(info.formats, "audioandvideo");
//     const video = ytdl(url, { format });
//     //pipe the video to the write stream
//     video.pipe(fs.createWriteStream(videoPath));
//     //other events
//   });

//   video.on("response", (res) => {
//     console.log(
//       `Downloading video with a total size of ${res.headers["content-length"]} bytes...`
//     );
//   });

//   const saveV = await Video.create({
//     id: videoId,
//     title: title,
//     url: url,
//     directory: videoPath,
//   });

//   video.on("end", () => {
//     console.log("complete download");
//   });
//   res.status(200).send({
//     status: "Video download complete!",
//     saveV,
//   });
// });

// UPDATE
const youtube = google.youtube({
  version: "v3",
  auth: "AIzaSyAWG8H16RV5KBGsTYo6Epype4Ro9UpGiNk",
});

const getVideoTitle = async (videoId) => {
  const res = await youtube.videos.list({
    part: "snippet",
    id: videoId,
  });

  console.log("title...", res.data.items[0].snippet.title);

  return res.data.items[0].snippet.title;
};

const downloadVideo = catchAsync(async (req, res, next) => {
  const { url, directory } = req.body;

  const videoId = url.split("=")[1];
  const title = await getVideoTitle(videoId);
  console.log("title***", title);

  const desiredName = `${title}-${Date.now()}`;
  const videoPath = `${userProfile}/Downloads/${desiredName}.mp4`;

  if (!url) return next(new AppError(404, "Url is required"));

  const video = ytdl(url, { filter: "audioandvideo" });

  video.pipe(fs.createWriteStream(videoPath));

  ytdl.getInfo(url, (err, info) => {
    if (err) throw err;
    const format = ytdl.filterFormats(info.formats, "audioandvideo");
    const video = ytdl(url, { format });
    //pipe the video to the write stream
    video.pipe(fs.createWriteStream(videoPath));
    //other events
  });

  video.on("response", (res) => {
    console.log(
      `Downloading video with a total size of ${res.headers["content-length"]} bytes...`
    );
  });

  const saveV = await Video.create({
    id: videoId,
    title: title,
    url: url,
    directory: videoPath,
  });
  video.on("end", async () => {
    console.log("complete download");
    res.status(201).send({
      status: "Video download complete!",
      saveV,
    });
  });
});

module.exports = { downloadVideo, getAllVideos, getOneVideo };
