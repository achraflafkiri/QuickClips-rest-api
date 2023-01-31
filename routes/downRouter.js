const { Router } = require("express");
const {
  downloadVideo,
  getAllVideos,
  getOneVideo,
} = require("../controllers/downController");

const router = Router();

router.route("/").get(getAllVideos);
router.route("/:videoId").get(getOneVideo);
router.route("/download").post(downloadVideo);
module.exports = router;
