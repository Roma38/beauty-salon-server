var express = require("express");
var router = express.Router();
var Staff = require("../models/staff");
var multer = require("multer");

var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "./public/images");
  },
  filename: function(req, file, cb) {
    cb(null, `${req.body.name}.${file.originalname.split(".")[1]}`);
  }
});

var fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg"
  ) {
    cb(null, true);
  } else {
    cb(new Error("Picture wasn't saved"), false);
  }
};

var upload = multer({
  storage,
  limits: {
    fileSize: 5e6
  },
  fileFilter
}).single("masterPicture");

/* Add staff. */
router.post("/add", function(req, res, next) {
  upload(req, res, function(err) {
    //TODO: handle errors
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading.
    } else if (err) {
      // An unknown error occurred when uploading.
    }
    // Everything went fine.

    const { name, description, services } = req.body;
    const staff = new Staff({
      name,
      description,
      services,
      pictureURL: req.file ? req.file.path : null
    });

    staff
      .save()
      .then(() =>
        res.status(201).json({
          name,
          description,
          services,
          pictureURL: req.file ? req.file.path : null
        })
      )
      .catch(error => {
        console.error(error);
        res.status(400).send({
          error
        });
      });
  });
});

module.exports = router;
