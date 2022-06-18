const express = require("express");
const { createPost, getAllPosts, deletePost, updatePost } = require("../controllers/post.controllers");
const multer = require("../middleware/multer-config");
const routeur = express.Router();
const authGuard = require("../middleware/auth.guard");


routeur.post("/", authGuard, multer, createPost);
routeur.get("/", authGuard, getAllPosts);
routeur.delete("/:id", authGuard, deletePost);
routeur.put("/:id", authGuard, multer, updatePost);



module.exports = routeur;
