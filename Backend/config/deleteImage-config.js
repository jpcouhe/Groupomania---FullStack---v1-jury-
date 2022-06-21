const fs = require("fs");

exports.deleteImage = (item, folder) => {
    let filename;

    if (item.content) {
        filename = item.content.split("/images/" + folder + "/")[1];
    } 

    if (item.profile_picture_location) {
        filename = item.profile_picture_location.split("/images/" + folder + "/")[1];
    }

    fs.unlink("images/" + folder + "/" + filename, (err) => {
        if (err) console.log(err);
    });
};
