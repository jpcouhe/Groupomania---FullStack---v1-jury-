const express = require("express");
const { getAllCategorie } = require("../controllers/categories.controllers");


const routeur = express.Router();
const authGuard = require("../middleware/auth.guard");

routeur.get("/", authGuard, getAllCategorie);

module.exports = routeur;
