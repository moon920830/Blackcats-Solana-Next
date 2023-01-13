import fs from "fs";

/**
 * 
 * @param {*} file  multi-part form data file
 * @param {*} type is artist? : listener?
 * @param {*} previousFileName  For remove the previous file, need a previous file name
 * @returns save file in the public directory and remove the previous file
 */

export const saveFile = async (file, type, previousFileName) => {
  if (file) {
    const data = fs.readFileSync(file.filepath);
    if (type === "avatar") {
      let savePath = `./public/images/avatars/${file.newFilename}.jpg`;
      console.log("save file name(avatar): ", savePath);
      fs.writeFileSync(savePath, data);
      if (previousFileName && previousFileName !== "default.jpg") {
        let unlinkPath = `./public/images/avatars/${previousFileName}`;
        if (fs.existsSync(unlinkPath)) {
          console.log("remove the previous file name(avatar): ", unlinkPath);
          fs.unlinkSync(unlinkPath);
        }
        console.log("there are no files to remove for you: avatar image");
        // fs.unlinkSync(`./public/images/avatars/${previousFileName}`);
      }
    } else if (type === "cover") {
      let savePath = `./public/images/profile/${file.newFilename}.jpg`;
      console.log("save file name(cover): ", savePath);
      fs.writeFileSync(`./public/images/profile/${file.newFilename}.jpg`, data);
      if (previousFileName && previousFileName !== "default.jpg") {
        let unlinkPath = `./public/images/avatars/${previousFileName}`;
        if (fs.existsSync(unlinkPath)) {
          console.log("remove the previous file name(cover): ", unlinkPath);
          fs.unlinkSync(unlinkPath);
        }
        console.log("there are no files to remove for you: cover image");
        // fs.unlinkSync(`./public/images/profile/${previousFileName}`);
      }
    }
  }
  return `${file.newFilename}.jpg`;
};
