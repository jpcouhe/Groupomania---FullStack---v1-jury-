const db = require("../config/db-config");

exports.getAllCategorie = (req, res) => {
    try {
        db.query(
            `
            SELECT
                categories_id AS categoriesId,
                name,
                slug
            FROM contentcategorie
        `,
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

exports.insertCategorie = (req, res) => {};
