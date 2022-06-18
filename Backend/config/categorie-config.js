exports.setCategorie = (categorie) => {
    switch (categorie) {
        case "music":
            return 1;

        case "movie":
            return 2;

        case "funny":
            return 3;

        case "lifestyle":
            return 4;

        case "sport":
            return 5;

        case "technology":
            return 6;
    }
};