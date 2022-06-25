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
                return res.status(500).json({ error: "Votre requête n'a pas pu aboutir" });
            } else {
                return res.status(200).json(result);
            }
        }
    );
};

exports.insertCategorie = (req, res) => {
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
                return res
                    .status(500)
                    .json({ error: "Votre requête n'a pas pu aboutir, erreur 1062, duplicate key" });
            } else {
                return res.status(201).json(result);
            }
        }
    );
};
