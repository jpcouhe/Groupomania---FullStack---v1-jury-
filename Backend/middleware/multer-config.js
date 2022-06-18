const multer = require("multer");
const uuid = require("uuid");
// recupere la data qui est sous forme de multipart/form-data

const MIME_TYPES = {
    "image/jpg": "jpg",
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/gif": "gif",
};

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        if (req.baseUrl == "/api/user") {
            callback(null, "images/profil_picture");
        } else if (req.baseUrl == "/api/post") {
            callback(null, "images/post_picture");
        } else {
            callback(null, "images/comment_picture");
        }
    },
    filename: (req, file, callback) => {
        const extension = MIME_TYPES[file.mimetype];
        callback(null, uuid.v4() + "." + extension);
    },
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, callback) => {
        if (MIME_TYPES.hasOwnProperty(file.mimetype)) {
            callback(null, true);
        } else {
            callback(new Error("Invalid mime type"));
        }
    },
});

module.exports = upload.single("image");
