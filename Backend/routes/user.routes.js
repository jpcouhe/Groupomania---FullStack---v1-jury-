const express = require("express");
const {
    getAllUsers,
    getOneUser,
    updateProfilUser,
    updatePasswordUser,
    deleteUser,

} = require("../controllers/user.controllers");

const multer = require("../middleware/multer-config");
const routeur = express.Router();

const authGuard = require("../middleware/auth.guard");
//--------------------------------------------

routeur.get("/", authGuard, getAllUsers);
routeur.get("/:id", authGuard, getOneUser);

routeur.put("/:id", authGuard, multer, updateProfilUser);
routeur.put("/password/:id", authGuard, updatePasswordUser);
routeur.delete("/:id", authGuard, deleteUser);
module.exports = routeur;
