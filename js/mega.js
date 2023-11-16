// This script should look into de csv folder, if there is wifi 
// connection available it may try to upload the files one by one 
// on the folders that match the date and time
const { Storage } = require("megajs");
const fs = require("fs");
const { write_files } = require("./display");
const credentials = require("./mega.json");

const folderPath = __dirname.replace('/js', "/csv")
let storage;

const getFolderName = () => {
    return new Date().toLocaleString("SV").split("-").slice(0, 2).join("_");
};

const uploadFile = async (filename, credentials) => {
    // This function should save the file in a folder according to this structure
    //
    // logger
    //    --- date_time
    //          --- date_time_id.csv    
    //
    const folderName = "logger"
    const subfolder = filename.split("_").slice(0, 2).join("_")
    const { email, password } = credentials;
    storage = new Storage({
        email,
        password,
        userAgent: "ExampleClient/1.0",
    });
    await storage.ready;
    console.log("... logged in");
    const fileStream = fs.createReadStream(filename);
    const size = fs.statSync(filename).size;
    let folder = storage.root.children?.find((file) => file.name === folderName);



    let target = folder.children?.find((c) => c.name === subfolder);

    if (target === undefined) {
        console.log("... subfolder not found, creating", subfolder);
        target = await folder.mkdir(subfolder);
    } else {
        console.log("... subfolder", subfolder, "found");
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

const getFiles = async () => {
    let csvFiles
    fs.readdir(folderPath, (err, files) => {
        if (err) {
            console.error('Error reading folder:', err);
            return;
        }
        console.log('Files in the folder:');
        csvFiles = files.filter(f => f.includes(".csv"))
        console.log({ files })
        console.log({ csvFiles })
        write_files(csvFiles.length)
    });
}


uploadFile(__dirname.replace("/js", "/csv/") + "20231116_171100_1.csv", credentials).then((link) => console.log({ link }));

exports.uploadFile = uploadFile;
exports.getFiles = getFiles;