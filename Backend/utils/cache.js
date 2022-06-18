// Création d'une table dans la base de donnée pour stocker les tokens qui ne sont plus valide grâce au package npm
const dotenv = require("dotenv").config();
const Keyv = require("@keyv/mysql");
const keyv = new Keyv("mysql://" + process.env.KEYV_PARAM);

exports.set = (key, value, ttl) => keyv.set(key, value, ttl);
exports.get = (key) => keyv.get(key);
exports.del = (key) => keyv.delete(key);
