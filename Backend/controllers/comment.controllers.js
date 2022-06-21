const db = require("../config/db-config");
const { deleteImage } = require("../config/deleteImage-config");

exports.createComment = (req, res) => {
    const bodyPost = JSON.parse(req.body.comment);
    const { threadId, content } = bodyPost;

    let data;
    if (!req.file && !content) {
        return res.status(400).json({ message: "Please enter a message" });
    }

    if (req.file) {
        data = {
            content: req.protocol + "://" + req.get("host") + "/images/comment_picture/" + req.file.filename,
            // récupére le précédant ID
            threads_id: threadId,
            users_id: req.auth,
            postTypes_id: 1,
        };
    } else {
        data = {
            content: content,
            threads_id: threadId,
            users_id: req.auth,
            postTypes_id: 2,
        };
    }

    db.query("INSERT INTO contents SET ?", data, (error, results) => {
        if (error) {
            return res.status(500).json({ error: error.sqlMessage });
        } else {
            return res.status(201).json({ message: "Comment has been registered" });
        }
    });
};

exports.deleteComment = (req, res) => {
    const commentId = req.params.id;
    const role = req.role;

    db.query("SELECT * FROM contents WHERE contents_id = ?", [commentId], (error, result) => {
        if (error) return res.status(500).json({ error: error.sqlMessage });
        if (!result[0]) {
            return res.status(404).json({ message: "Object not found !" });
        } else if (result[0].users_id !== req.auth && role === false) {
            return res.status(401).json({ message: "unauthorized request" });
        } else {
            db.query("DELETE FROM contents WHERE contents_id = ?", [commentId], (error, resultat) => {
                if (error) {
                    return res.status(500).json({ error: error.sqlMessage });
                } else {
                    if (result[0].postTypes_id == 1) {
                        deleteImage(result[0], "comment_picture");
                    }
                    res.status(200).json({ message: "Deleted !" });
                }
            });
        }
    });
};

exports.getAllComments = (req, res) => {
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
                return res.status(500).json({ error: error.sqlMessage });
            } else {
                return res.status(200).json(result);
            }
        }
    );
};

exports.getNumberCommentsForAThread = (req, res) => {
    const threadId = parseInt(req.params.id);
    db.query(
        `SELECT SUM(CASE WHEN contents.threads_id = ? THEN 1 ELSE 0 END) nbComment FROM contents`,
        [threadId],
        (error, result) => {
            if (error) {
                return res.status(500).json({ error: error.sqlMessage });
            } else {
                // J'enlève le Post Initial
                let comment = result[0].nbComment - 1;
                return res.status(200).json(comment);
            }
        }
    );
};
//
