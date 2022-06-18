const express = require("express");
const { createPost, getAllPosts, deletePost, updatePost } = require("../controllers/post.controllers");
const multer = require("../middleware/multer-config");
const routeur = express.Router();
const authGuard = require("../middleware/auth.guard");
const { isAdmin } = require("../middleware/admin");

routeur.post("/", authGuard, multer, createPost);
routeur.get("/", authGuard, getAllPosts);
routeur.delete("/:id", authGuard, isAdmin, deletePost);
routeur.put("/:id", authGuard, isAdmin, multer, updatePost);

module.exports = routeur;
