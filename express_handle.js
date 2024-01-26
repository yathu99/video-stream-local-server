const express = require("express");
const app = express();
const path = require('path')
const fs = require("fs");
var filenameToView='BLAST.mp4';
app.use(express.static(path.join(__dirname,'public')))


app.get("/", function (req, res) {
    res.sendFile(__dirname + "/main.html");
    //res.contentType(path.basename(filePath))
});

app.get("/listing", function (req, res) {
    var files = fs.readdirSync('./files/');
    files =  files.map((elem,index) => {return { "No.":index+1,"Name":elem}})
    res.send(files);
    //res.contentType(path.basename(filePath))
});

app.get("/video/:videoFile", function (req, res) {
    filenameToView = req.params.videoFile;
    res.sendFile(__dirname + "/video.html");
});

app.get("/playVideo", function (req, res) {
    const range = req.headers.range;
    if (!range) {
        res.status(400).send("Requires Range header");
    }
    const filename = path.join('files',filenameToView);
    const videoSize = fs.statSync(filename).size;
    const CHUNK_SIZE = 10 ** 6;
    const start = Number(range.replace(/\D/g, ""));
    const end = Math.min(start + CHUNK_SIZE, videoSize - 1);
    const contentLength = end - start + 1;
    const headers = {
        "Content-Range": `bytes ${start}-${end}/${videoSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": contentLength,
        "Content-Type": "video/mp4",
    };
    res.writeHead(206, headers);
    const videoStream = fs.createReadStream(filename, { start, end });
    videoStream.pipe(res);

});

app.listen(8000, function () {
    console.log("Listening on port 8000!");
});