const express = require("express");
const { contentLike} = require("../controllers/like.controllers");

const routeur = express.Router();
const authGuard = require("../middleware/auth.guard");

routeur.post("/:id", authGuard, contentLike);

module.exports = routeur;
