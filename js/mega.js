// This script should look into de csv folder, if there is wifi 
// connection available it may try to upload the files one by one 
// on the folders that match the date and time
const { Storage } = require("megajs");
const fs = require("fs");
const credentials = require("./mega.json")
console.log(credentials)

let storage;

const getFolderName = () => {
    return new Date().toLocaleString("SV").split("-").slice(0, 2).join("_");
};

const uploadFile = async (filename, name, credentials) => {
    const { email, password } = credentials;
    storage = new Storage({
        // email: "km115.franco@gmail.com",
        // password: "1618@Jabiru",
        email,
        password,
        userAgent: "ExampleClient/1.0",
    });
    await storage.ready;
    console.log("... logged in");
    const fileStream = fs.createReadStream(filename);
    const size = fs.statSync(filename).size;
    const folderName = getFolderName();
    let folder = storage.root.children?.find((file) => file.name === name);

    if (folder === undefined) {
        console.log("... folder not found, creating ", name);
        folder = await storage.mkdir(name);
    } else {
        console.log("... folder", name, "found");
    }

    let target = folder.children?.find((c) => c.name === folderName);

    if (target === undefined) {
        console.log("... subfolder not found, creating", folderName);
        target = await folder.mkdir(folderName);
    } else {
        console.log("... subfolder", folderName, "found");
    }

    const file = await storage.upload(
        {
            name: filename.split("/").pop(),
            size,
            directory: false,
        },
        fileStream
    ).complete;

    console.log("...file", filename.split("/").pop(), "was uploaded!");
    file.moveTo(target);

    const link = await file.link();
    storage.close();
    console.log("... returning link");

    return link;
};

// uploadFile("/home/fx/Desktop/icon.png", "franco_2", {
//   email: "km115.franco@gmail.com",
//   password: "1618@Jabiru",
// }).then((link) => console.log({ link }));

exports.uploadFile = uploadFile;