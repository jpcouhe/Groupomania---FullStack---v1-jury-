const db = require("../config/db-config");

exports.getAllCategorie = (req, res) => {
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
                return res.status(500).json({ error: error.sqlMessage });
            } else {
                return res.status(200).json(result);
            }
        }
    );
};

exports.insertCategorie = async (req, res) => {
    const { name, slug } = req.body;

    db.query(
        `
            INSERT INTO 
                contentcategorie  
            SET ?
        `,
        {
            name: name,
            slug: slug,
        },
        (error, result) => {
            if (error) {
                return res.status(500).json({ error: error.sqlMessage });
            } else {
                return res.status(201).json(result);
            }
        }
    );
};
