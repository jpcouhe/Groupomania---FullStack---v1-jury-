const db = require("../config/db-config");
const bcrypt = require("bcrypt");
const fs = require("fs");

exports.getAllUsers = (req, res) => {
    try {
        db.query(
            `SELECT 
                users_id AS userId, 
                firstname, 
                lastname, 
                email, 
                profile_picture_location AS imgUser 
            FROM users 
            ORDER BY lastname`,
            (error, result) => {
                if (error) {
                    throw error;
                } else {
                    return res.status(200).json(result);
                }
            }
        );
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getOneUser = (req, res) => {
    const userId = req.params.id;
    try {
        db.query(
            `SELECT 
                users_id AS userId, 
                firstname, 
                lastname, 
                email, 
                role_id as role,
                profile_picture_location AS imgUser 
            FROM users 
            WHERE users_id = ? `,
            [userId],
            (error, result) => {
                if (error) {
                    throw error;
                } else {
                    return res.status(200).json(result[0]);
                }
            }
        );
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateProfilUser = (req, res) => {
    try {
        const userId = req.params.id;
        const image = req.body.image;
        const bodyUser = JSON.parse(req.body.user);
        const lastname = bodyUser.lastname;
        const firstname = bodyUser.firstname;
        if (!lastname || !firstname) {
            return res.status(404).json({ error: "Please Enter informations" });
        } else {
            db.query(
                `
                SELECT 
                    * 
                FROM users 
                WHERE users_id = ?`,
                [userId],
                (error, result) => {
                    if (error) throw error;
                    if (!result[0] || result[0].users_id !== req.auth) {
                        if (req.file) {
                            fs.unlink(req.file.path, (error) => {
                                if (error) throw error;
                            });
                        }
                        if (!result[0]) return res.status(404).json({ message: "User not found !" });
                        else return res.status(401).json({ message: "Unauthorized request" });
                    }

                    if (req.file) {
                        db.query(
                            `
                            UPDATE 
                                users 
                            SET ? 
                            WHERE users_id = ?`,
                            [
                                {
                                    profile_picture_location:
                                        req.protocol +
                                        "://" +
                                        req.get("host") +
                                        "/images/profil_picture/" +
                                        req.file.filename,
                                    firstname: firstname,
                                    lastname: lastname,
                                },
                                userId,
                            ],
                            (error, updateUser) => {
                                if (error) {
                                    throw error;
                                } else {
                                    // Pour la page GetStarted, l'utilisateur n'a pas de photo de profil avant d'update, pour cette page. Route commune avec GetStart et MiseAJour
                                    const imageProfil = result[0].profile_picture_location;
                                    if (imageProfil !== null) {
                                        //On vérifie que l'image n'est pas une image par defaut pour ne pas la supprimer
                                        const isImageProfilDefault =
                                            imageProfil.includes("/images/default_picture");
                                        if (isImageProfilDefault === false) {
                                            const filename =
                                                result[0].profile_picture_location.split(
                                                    "/images/profil_picture/"
                                                )[1];

                                            fs.unlink("images/profil_picture/" + filename, (error) => {
                                                if (error) throw error;
                                            });
                                        }

                                        return res.status(200).json({ message: "User has been updated" });
                                    } else {
                                        return res.status(200).json({ message: "User has been updated" });
                                    }
                                }
                            }
                        );
                    } else {
                        db.query(
                            `
                            UPDATE 
                                users 
                            SET ? 
                            WHERE users_id = ?`,
                            [
                                {
                                    profile_picture_location: req.body.image,
                                    firstname: firstname,
                                    lastname: lastname,
                                },
                                userId,
                            ],
                            (error, resultat) => {
                                if (error) {
                                    throw error;
                                } else {
                                    return res.status(200).json({ message: "User has been updated" });
                                }
                            }
                        );
                    }
                }
            );
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updatePasswordUser = async (req, res) => {
    const userId = req.params.id;
    const oldPassword = req.body.oldpassword;
    const newPassword = req.body.newpassword;
    if (oldPassword == newPassword) return res.status(405).json({ message: "New password already used" });

    db.query(
        `
        SELECT 
            * 
        FROM users 
        WHERE users_id = ?`,
        [userId],
        async (error, result) => {
            if (error) {
                throw error;
            }
            if (!result[0]) {
                return res.status(404).json({ message: "User not found !" });
            } else {
                const userValid = await bcrypt.compare(oldPassword, result[0].password);
                if (!userValid) {
                    return res.status(401).json({ message: "Old Password incorrect" });
                } else {
                    const cryptPassword = await bcrypt.hash(newPassword, 12);
                    db.query(
                        `
                        UPDATE 
                            users 
                        SET password = ? 
                        WHERE users_id = ?`,
                        [cryptPassword, userId],
                        (error, result) => {
                            res.status(200).json({ message: "Password change ! " });
                        }
                    );
                }
            }
        }
    );
};
/* Deleting a user from the database. */
exports.deleteUser = (req, res) => {
    const userId = req.params.id;
    db.query(
        `
        SELECT 
            * 
        FROM users 
        WHERE users_id = ?`,
        [userId],
        (error, result) => {
            if (error) {
                throw error;
            }
            if (!result[0]) {
                return res.status(404).json({ error: "User not found !" });
            } else {
                db.query(
                    `
                    DELETE 
                    FROM users 
                    WHERE users_id = ?`,
                    [userId],
                    (error, resultat) => {
                        const imageProfil = result[0].profile_picture_location;
                        if (imageProfil !== null) {
                            const isImageProfilDefault = imageProfil.includes("/images/default_picture");
                            // Si inclue le chemin default_picture alors c'est une image par defaut donc je ne la supprime pas
                            if (isImageProfilDefault === false) {
                                const filename =
                                    result[0].profile_picture_location.split("/images/profil_picture/")[1];

                                fs.unlink("images/profil_picture/" + filename, (error) => {
                                    if (error) throw error;
                                });
                            }
                            return res.status(200).json({ message: "User Deleted" });
                        } else {
                            return res.status(200).json({ message: "User Deleted" });
                        }
                    }
                );
            }
        }
    );
};
