const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();

app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));

if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() + "-" + file.originalname;

    cb(null, uniqueName);
  }
});

// Allow 100 MB uploads
const upload = multer({
  storage,

  limits: {
    fileSize: 100 * 1024 * 1024
  },

  fileFilter: (req, file, cb) => {

    const allowed = [
      ".pdf",
      ".epub",
      ".docx",
      ".txt"
    ];

    const ext =
      path.extname(file.originalname)
      .toLowerCase();

    if (allowed.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error("Unsupported file"));
    }
  }
});

let books = [];

// Upload endpoint
app.post(
  "/upload",
  upload.single("ebook"),

  (req, res) => {

    if (!req.file) {

      return res
        .status(400)
        .json({
          message: "No file uploaded"
        });
    }

    const book = {
      id: Date.now(),

      name: req.file.originalname,

      file: req.file.filename,

      size:
        (req.file.size / 1024 / 1024)
        .toFixed(2)
    };

    books.push(book);

    res.json(book);
  }
);

// Get all books
app.get("/books", (req, res) => {
  res.json(books);
});

app.listen(3000, () => {
  console.log(
    "Server running on http://localhost:3000"
  );
});