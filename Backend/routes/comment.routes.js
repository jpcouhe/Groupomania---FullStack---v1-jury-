const express = require("express");
const {
    createComment,
    getAllComments,
    deleteComment,
    getNumberCommentsForAThread,
} = require("../controllers/comment.controllers");
const { isAdmin } = require("../middleware/admin");

const multer = require("../middleware/multer-config");
const routeur = express.Router();
const authGuard = require("../middleware/auth.guard");

routeur.post("/", authGuard, multer, createComment);
routeur.get("/:id/:start/:limit", authGuard, getAllComments);
routeur.get("/:id/nb", authGuard, getNumberCommentsForAThread);
routeur.delete("/:id", authGuard, isAdmin, deleteComment);

module.exports = routeur;
