const { Router } = require("express");
const express = require("express");
const { getAllCategorie, insertCategorie } = require("../controllers/categories.controllers");

const routeur = express.Router();
const authGuard = require("../middleware/auth.guard");

routeur.get("/", authGuard, getAllCategorie);
routeur.post("/", authGuard, insertCategorie);
module.exports = routeur;
