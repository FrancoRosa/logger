// This script should look into de csv folder, if there is wifi 
// connection available it may try to upload the files one by one 
// on the folders that match the date and time
const { Storage } = require("megajs");
const fs = require("fs");
const { write_files } = require("./display");
const credentials = require("./mega.json");

const folderPath = __dirname.replace('/js', "/csv")
let storage;

const connectToMega = async () => {

}

const getFiles = () => {
    let files = fs.readdirSync(folderPath)
    csvFiles = files.filter(f => f.includes(".csv"))
    write_files(csvFiles.length)
    return csvFiles
}
const uploadFile = async (filename, folder) => {
    let subfolder = filename.split("_").slice(0, 2).join("_").replace(".csv", "")
    console.log(folderPath + "/" + filename)
    let fileStream = fs.createReadStream(folderPath + "/" + filename);
    let size = fs.statSync(folderPath + "/" + filename).size;
    let target = folder.children?.find((c) => c.name === subfolder);

    if (target === undefined) {
        console.log("... subfolder not found, creating", subfolder);
        target = await folder.mkdir(subfolder);
        console.log("... subfolder", subfolder, "created");

    } else {
        console.log("... subfolder", subfolder, "found");
    }
    // try {
    console.log("... trying to upload");

    const file = await storage.upload(
        {
            name: filename,
            size,
            directory: false,
        },
        fileStream
    ).complete;
    console.log("... file conmpleted");

    await file.moveTo(target);
    console.log("...file", filename, "was uploaded!");
    fs.unlinkSync(folderPath + "/" + filename)
    console.log("...file", filename, "was deleted!");
    // } catch (error) {
    //     console.log("something happended")
    //     consoler.log(error)
    // }
};

const uploadAll = async (filesToUpload, folder) => {
    for (let filename of filesToUpload) {
        try {
            // Assuming yourAsyncFunction is an asynchronous operation, replace it with your actual asynchronous function
            console.log(`...Processing item: ${filename}`);

            await uploadFile(filename, folder);
            console.log(`Processed item: ${filename}`);
        } catch (error) {
            console.error(`Error processing filename ${filename}: ${error}`);
            // If you want to continue processing other items even if one fails, you can handle the error here
        }
    }
}

const uploadFiles = async () => {
    // This function should save the file in a folder according to this structure
    //
    // logger
    //    --- date_time
    //          --- date_time_id.csv    
    //
    const folderName = "logger"
    let filesToUpload = getFiles()
    if (filesToUpload.length > 0) {
        const { email, password } = credentials;
        storage = new Storage({
            email,
            password,
            userAgent: "ExampleClient/1.0",
        });
        await storage.ready;
        console.log("... logged in");
        let folder = storage.root.children?.find((file) => file.name === folderName);
        if (folder === undefined) {
            console.log("... folder not found, creating ", folderName);
            folder = await storage.mkdir(folderName);
        } else {
            console.log("... folder", folderName, "found");
        }

        await uploadAll(filesToUpload, folder)

        storage.close();
    }
};


exports.uploadFiles = uploadFiles;
exports.getFiles = getFiles;