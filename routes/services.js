var express = require("express");
var router = express.Router();
var Service = require("../models/service");
var multer = require("multer");
var categories = require("../constants");

//multer setup
var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "./public/images/services");
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

// Get services
router.get("/", function(req, res, next) {
  Service.find()
    .then(items => res.status(201).json({ items, categories }))
    .catch(error => {
      console.log(error);
      res.status(500).json({ error }); //TODO: status code
    });
});
//************************************************************* */
// Add service
router.post("/", function(req, res, next) {
  upload(req, res, function(err) {
    //TODO: handle errors
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading.
    } else if (err) {
      // An unknown error occurred when uploading.
    }
    // Everything went fine.

    const { name, description, category, duration, price } = req.body;

    console.log("**********************************************");
    console.log(req.body);
    console.log("**********************************************");

    const service = new Service({
      name,
      description,
      category,
      duration: JSON.parse(duration),
      price,
      pictureURL: req.file
        ? `${name}.${req.file.originalname.split(".")[1]}`
        : null
    });

    service
      .save()
      .then(service => res.status(201).json(service))
      .catch(error => {
        if (error.code === 11000) {
          res
            .status(422)
            .json({ error: "Service with such title already exists" });
        }
        console.error(error);
        res.status(500).json(error); //TODO: status code
      });
  });
});

// //Edit staff
// router.put("/", function(req, res, next) {
//   upload(req, res, function(err) {
//     //TODO: handle errors
//     if (err instanceof multer.MulterError) {
//       // A Multer error occurred when uploading.
//     } else if (err) {
//       // An unknown error occurred when uploading.
//     }
//     // Everything went fine.

//     const { _id, name, description, services, pictureURL } = req.body;

//     const newStaff = {
//       name,
//       description,
//       services: JSON.parse(services),
//       pictureURL: req.file
//         ? `${name}.${req.file.originalname.split(".")[1]}`
//         : pictureURL
//     };

//     Staff.findByIdAndUpdate(_id, newStaff)
//       .then(({ _id }) => res.status(201).json({ ...newStaff, _id }))
//       .catch(error => {
//         if (error.code === 11000) {
//           res
//             .status(422)
//             .json({ error: "Master with such name already exists" });
//         }
//         console.error(error);
//         res.status(500).json(error); //TODO: status code
//       });
//   });
// });

// //Delete staff
// router.delete("/", multer().none(), function(req, res, next) {
//   Staff.findByIdAndDelete(req.body._id)
//     .then(() => res.status(200).json({ message: "Successfully deleted" }))
//     .catch(error => {
//       console.error(error);
//       res.status(500).json(error); //TODO: status code
//     });
//   res.status(200).json(req.body);
// });

module.exports = router;
