const fs = require("fs");

exports.deleteImage = (item, folder) => {
    const filename = item.content.split("/images/" + folder + "/")[1];
    
    fs.unlink("images/" + folder + "/" + filename, () => {});
};
