
const fs = require('fs');
const http = require('http');

const mime = require('mime');
//const phaser = require('phaser');

// the directory that the client files are located in
const CLIENT_DIRECTORY = './client'

// returns the filepath of the requested file
function getFilePath(url) {
    return `${CLIENT_DIRECTORY}${url == '/' ? '/index.html' : url}`
}

// return the content type of the file
function getContentType(url) {
    return url == '/' ? 'text/html' : mime.getType(url);
}

// create a listener
const server = http.createServer((req, res) => {
    console.log(`File path: ${getFilePath(req.url)}`);
    console.log(`Content type: ${getContentType(req.url)}\n`);

    fs.readFile(
        getFilePath(req.url),
        (err, data) => {
            // if and error occurs while reading the file
            if (err) {
                console.log('An error has occured.');
                throw err;
            }
            // write the response header
            res.writeHead(200, { 'Content-Type': getContentType(req.url) });

            // write the data in the file
            res.write(data);
            res.end();
        }
    );

}).listen(8000);