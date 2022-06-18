const express = require("express");
const { signup, login, logout } = require("../controllers/auth.controllers");
const authGuard = require("../middleware/auth.guard");
const routeur = express.Router();


routeur.post("/signup", signup);
routeur.post("/login", login);
routeur.post("/logout", authGuard, logout);

module.exports = routeur;
