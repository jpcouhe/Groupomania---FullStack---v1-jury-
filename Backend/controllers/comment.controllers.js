const db = require("../config/db-config");
const fs = require("fs");
const { deleteImage } = require("../config/deleteImage-config");
exports.createComment = (req, res) => {
    try {
        const bodyPost = JSON.parse(req.body.comment);
        const threadId = bodyPost.threadId;
        const content = bodyPost.content;

        if (!req.file && !content) {
            return res.status(400).json({ message: "Please enter a message" });
        } else {
            if (req.file) {
                db.query(
                    "INSERT INTO contents SET ?",
                    {
                        content:
                            req.protocol +
                            "://" +
                            req.get("host") +
                            "/images/comment_picture/" +
                            req.file.filename,
                        // récupére le précédant ID
                        threads_id: threadId,
                        users_id: req.auth,
                        postTypes_id: 1,
                    },
                    (error, results) => {
                        if (error) {
                            throw error;
                        } else {
                            return res.status(200).json({ message: "Comment has been registered" });
                        }
                    }
                );
            } else {
                db.query(
                    "INSERT INTO contents SET ?",
                    {
                        content: content,
                        threads_id: threadId,
                        users_id: req.auth,
                        postTypes_id: 2,
                    },
                    (error, results) => {
                        if (error) {
                            throw error;
                        } else {
                            return res.status(200).json({ message: "Comment has been registered" });
                        }
                    }
                );
            }
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteComment = (req, res) => {
    try {
        const commentId = req.params.id;
        db.query("SELECT * FROM contents WHERE contents_id = ?", [commentId], (error, result) => {
            if (error) throw error;
            if (!result[0]) {
                return res.status(404).json({ message: "Object not found !" });
            } else if (result[0].users_id !== req.auth) {
                return res.status(404).json({ message: "unauthorized request" });
            } else {
                db.query("DELETE FROM contents WHERE contents_id = ?", [commentId], (error, resultat) => {
                    if (error) {
                        throw error;
                    } else {
                        if (result[0].postTypes_id == 1) {
                            deleteImage(result[0], "comment_picture");
                        }
                        res.status(200).json({
                            message: "Deleted!",
                        });
                    }
                });
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAllComments = (req, res) => {
    try {
        const nbItems = parseInt(req.params.limit);
        let start = (req.params.start - 1) * nbItems;
        const threadId = req.params.id;
        db.query(
            `WITH tempTable AS (
                SELECT 
                    ROW_NUMBER() OVER (ORDER BY contents_id
                    ) row_num,
                    threads_id, 
                    contents_id, 
                    users_id, 
                    created_datetime, 
                    content 
                    FROM contents c 
                    WHERE c.threads_id = ?
                  
            )
            SELECT 
                tt.row_num,
                tt.contents_id, 
                tt.users_id, 
                tt.content, 
                tt.created_datetime, 
                u.lastname, 
                u.firstname, 
                u.profile_picture_location,
                SUM(CASE WHEN l.like_content_id IS NOT NULL THEN 1 ELSE 0 END) nbLike,
                SUM(CASE WHEN l.like_user_id = ? THEN TRUE ELSE FALSE END) isLike
            FROM tempTable tt
            LEFT JOIN likes l 
                ON tt.contents_id = l.like_content_id
            JOIN users u 
                ON tt.users_id = u.users_id
            WHERE tt.row_num > 1
            GROUP BY tt.contents_id, tt.users_id, tt.content, u.lastname, u.firstname, u.profile_picture_location, tt.created_datetime
            ORDER BY tt.created_datetime DESC
            LIMIT ? OFFSET ? ;`,
            [threadId, req.auth, nbItems, start],
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

exports.getNumberCommentsForAThread = (req, res) => {
    try {
        const threadId = parseInt(req.params.id);
        db.query(
            `SELECT SUM(CASE WHEN contents.threads_id = ? THEN 1 ELSE 0 END) nbComment FROM contents`,
            [threadId],
            (error, result) => {
                if (error) {
                    throw error;
                } else {
                    // J'enlève le Post Initial
                    let comment = result[0].nbComment - 1;
                    return res.status(200).json(comment);
                }
            }
        );
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
//
