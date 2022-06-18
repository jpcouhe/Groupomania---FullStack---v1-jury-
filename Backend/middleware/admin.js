const db = require("../config/db-config");

exports.isAdmin = (req, res, next) => {
    try {
        db.query(
            `
            SELECT 
                *
            FROM users
            WHERE users_id = ?
        `,
            [req.auth],
            (error, result) => {
                if (error) {
                    throw error;
                } else {
                    if (result[0].role_id !== 3) {
                        req.role = true;
                        next();
                    } else {
                        req.role = false;
                        next();
                    }
                }
            }
        );
    } catch (error) {
        res.status(500).json({ error });
    }
};
