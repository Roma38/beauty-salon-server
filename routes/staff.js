var express = require("express");
var router = express.Router();
var Staff = require("../models/staff");
var multer = require("multer");

//multer setup
var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "./public/images");
  },
  filename: function(req, file, cb) {
    cb(null, `${req.body.name}.${file.originalname.split(".")[1]}`);
  }
});

var fileFilter = (req, file, cb) => {
  if (["image/jpeg", "image/png", "image/jpg"].includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Wrong file format"), false);
  }
};

var upload = multer({
  storage,
  limits: {
    fileSize: 5e6
  },
  fileFilter
}).single("masterPicture");

// Get staff
router.get("/", function(req, res, next) {
  Staff.find().then(staff =>
    res
      .status(201)
      .json(staff)
      .catch(error => {
        console.log(error);
        res.status(500).json({ error });
      })
  );
});

// Add staff
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
          pictureURL: req.file
            ? `${name}.${req.file.originalname.split(".")[1]}`
            : null
        })
      )
      .catch(error => {
        console.error(error);
        res.status(500).json({ error });
      });
  });
});

module.exports = router;
