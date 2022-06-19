const db = require("../config/db-config");
const fs = require("fs");
const { setCategorie } = require("../config/categorie-config");
const { deleteImage } = require("../config/deleteImage-config");

exports.createPost = (req, res) => {
    try {
        const bodyPost = JSON.parse(req.body.post);
        const title = bodyPost.title;
        const content = bodyPost.content;
        let categorie = bodyPost.categorie;

        if (!title || !categorie || (!req.file && !content)) {
            fs.unlink("images/post_picture/" + req.file.filename, () => {});
            return res.status(400).json({ message: "Please enter the information" });
        } else {
            db.query(
                `
                INSERT INTO 
                    thread 
                SET 
                    title = ?, 
                    categories_id = ?`,
                [title, categorie],
                (error, results) => {
                    if (error) {
                        throw error;
                    } else {
                        if (req.file) {
                            db.query(
                                `
                                INSERT INTO 
                                    contents 
                                SET ?`,
                                {
                                    content:
                                        req.protocol +
                                        "://" +
                                        req.get("host") +
                                        "/images/post_picture/" +
                                        req.file.filename,
                                    // récupére le précédant ID
                                    threads_id: results.insertId,
                                    users_id: req.auth,
                                    postTypes_id: 1,
                                },
                                (error, results) => {
                                    if (error) {
                                        throw error;
                                    } else {
                                        return res.status(201).json({ message: "Post has been created" });
                                    }
                                }
                            );
                        } else {
                            db.query(
                                `
                                INSERT INTO 
                                    contents 
                                SET ?`,
                                {
                                    content: content,
                                    threads_id: results.insertId,
                                    users_id: req.auth,
                                    postTypes_id: 2,
                                },
                                (error, results) => {
                                    if (error) {
                                        throw error;
                                    } else {
                                        return res.status(201).json({ message: "Post has been created" });
                                    }
                                }
                            );
                        }
                    }
                }
            );
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAllPosts = (req, res) => {
    try {
        const nbItems = parseInt(req.query.limit);

        let start = (req.query.start - 1) * nbItems;
        let categorie = req.query.category;

        if (categorie === "null" || categorie === undefined) {
            db.query(
                `
                WITH tempTable AS (
                    SELECT 
                        threads_id, 
                        MIN(created_datetime) created_datetime
                    FROM contents
                    GROUP BY threads_id 
                )
                SELECT 
                    t.threads_id,
                    t.title, 
                    c.content, 
                    c.created_datetime, 
                    c.contents_id, 
                    u.lastname, 
                    u.firstname, 
                    u.profile_picture_location, 
                    c.users_id,     
                    cc.name as categorie,  
                    cc.slug as categorieSlug,    
                    SUM(CASE WHEN l.like_content_id IS NOT NULL THEN 1 ELSE 0 END) nbLike,
                    SUM(CASE WHEN l.like_user_id = ? THEN true ELSE false END) isLiked
                FROM tempTable tt
                JOIN thread t
                    ON tt.threads_id = t.threads_id
                JOIN contents c
                    ON tt.threads_id = c.threads_id AND tt.created_datetime = c.created_datetime
                LEFT JOIN likes l
                    ON c.contents_id = l.like_content_id
                JOIN users u 
                    ON c.users_id = u.users_id
                JOIN contentcategorie cc
                    ON t.categories_id = cc.categories_id
                GROUP BY t.threads_id, t.title, c.content, c.created_datetime, c.contents_id, u.lastname, u.firstname, u.profile_picture_location,c.users_id, cc.name, cc.slug
                ORDER BY tt.created_datetime DESC
                LIMIT ? OFFSET ? ;`,
                [req.auth, nbItems, start],
                (error, result) => {
                    if (error) {
                        throw error;
                    } else {
                        return res.status(200).json(result);
                    }
                }
            );
        } else {
            db.query(
                `
                        WITH tempTable AS (
                            SELECT
                                threads_id,
                                MIN(created_datetime) created_datetime
                            FROM contents
                            GROUP BY threads_id
                        )
                        SELECT
                            t.threads_id,
                            t.title,
                            c.content,
                            c.created_datetime,
                            c.contents_id,
                            u.lastname,
                            u.firstname,
                            u.profile_picture_location,
                            c.users_id,
                            cc.name as categorie,
                            cc.slug as categorieSlug, 
                            SUM(CASE WHEN l.like_content_id IS NOT NULL THEN 1 ELSE 0 END) nbLike,
                            SUM(CASE WHEN l.like_user_id = ? THEN true ELSE false END) isLiked
                        FROM tempTable tt
                        JOIN thread t
                            ON tt.threads_id = t.threads_id
                        JOIN contents c
                            ON tt.threads_id = c.threads_id AND tt.created_datetime = c.created_datetime
                        LEFT JOIN likes l
                            ON c.contents_id = l.like_content_id
                        JOIN users u
                            ON c.users_id = u.users_id
                        JOIN contentcategorie cc
                        ON t.categories_id = cc.categories_id
                            WHERE cc.slug = ?
                            
                        GROUP BY t.threads_id, t.title, c.content, c.created_datetime, c.contents_id, u.lastname, u.firstname, u.profile_picture_location,c.users_id, cc.name,cc.slug
                        ORDER BY tt.created_datetime DESC
                        LIMIT ? OFFSET ? ;`,
                [req.auth, categorie, nbItems, start],
                (error, result) => {
                    if (error) {
                        throw error;
                    } else {
                        return res.status(200).json(result);
                    }
                }
            );
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deletePost = (req, res) => {
    try {
        const role = req.role;
        const postId = req.params.id;
              
        db.query(
            `
            SELECT 
                * 
            FROM contents 
            WHERE contents.threads_id = ?`,
            [postId],
            (error, result) => {
                if (error) throw error;
                if (!result[0]) {
                    return res.status(404).json({ message: "Object not found !" });
                } else if (result[0].users_id !== req.auth && role === false) {
                    return res.status(404).json({ message: "unauthorized request" });
                } else {
                    db.query(
                        "DELETE FROM thread WHERE thread.threads_id = ?",
                        [postId],
                        (error, resultat) => {
                            if (error) {
                                throw error;
                            } else {
                                if (result[0].postTypes_id == 1) {
                                    deleteImage(result[0], "post_picture");

                                    //Je supprime également les images des commentaires(Delete On Cascade des Posts)
                                    for (let i = 1; i < result.length; i++) {
                                        deleteImage(result[i], "comment_picture");
                                    }
                                }

                                res.status(200).json({ message: "Deleted !" });
                            }
                        }
                    );
                }
            }
        );
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updatePost = (req, res) => {
    try {
        const postId = parseInt(req.params.id);
        const bodyPost = JSON.parse(req.body.post);
        const title = bodyPost.title;
        const content = bodyPost.content;
        const role = req.role;
        let categorie = bodyPost.categorie;
        if (!categorie || !title) {
            return res.status(400).json({ message: "Veuillez renseigner tout les champs" });
        } else {
            db.query(
                `
                SELECT 
                    * 
                FROM contents 
                WHERE contents_id = ? `,
                [postId],
                (error, result) => {
                    if (error) throw error;
                    if (!result[0]) {
                        if (req.file) {
                            fs.unlink(req.file.path, (error) => {
                                if (error) throw error;
                            });
                        }
                        return res.status(404).json({ message: "Object not found !" });
                    }

                    if (result[0].users_id !== req.auth && role === "true") {
                        if (req.file) {
                            fs.unlink(req.file.path, (error) => {
                                if (error) throw error;
                            });
                        }
                        return res.status(401).json({ message: "unauthorized request" });
                    }

                    if (req.file) {
                        db.query(
                            `
                            UPDATE 
                                contents  
                            JOIN thread 
                                ON contents.threads_id = thread.threads_id
                            SET ? 
                            WHERE contents.contents_id = ?`,
                            [
                                {
                                    content:
                                        req.protocol +
                                        "://" +
                                        req.get("host") +
                                        "/images/post_picture/" +
                                        req.file.filename,
                                    title: title,
                                    categories_id: categorie,
                                    postTypes_id: 1,
                                },
                                postId,
                            ],
                            (error, resultat) => {
                                if (error) {
                                    throw error;
                                } else {
                                    deleteImage(result[0], "post_picture");

                                    return res.status(200).json({ message: "Post has been updated" });
                                }
                            }
                        );
                    } else {
                        db.query(
                            `
                            UPDATE 
                                contents  
                            JOIN thread 
                                ON contents.threads_id = thread.threads_id
                            SET ? WHERE contents.contents_id = ?`,
                            [
                                {
                                    content: content,
                                    title: title,
                                    postTypes_id: 2,
                                    categories_id: categorie,
                                },
                                postId,
                            ],
                            (error, resultat) => {
                                if (error) {
                                    throw error;
                                } else {
                                    deleteImage(result[0], "post_picture");

                                    return res.status(200).json({ message: "Post has been updated" });
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
