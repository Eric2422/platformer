
const fs = require('fs');
const http = require('http');

const mime = require('mime');

// the directory that the client files are located in
const CLIENT_DIRECTORY = './client'


// return the content type of the file
function getContentType(url) {
    return url == '/' ? 'text/html' : mime.getType(url);
}


// if the requested file is an HTML, return index.html
// otherwise, return the file that the URL points to
function getFilePath(url) {
    return `${CLIENT_DIRECTORY}${getContentType(url) === 'text/html' ? '/index.html' : url}`
}


// create a listener
const server = http.createServer((req, res) => {
    console.log(req.url);

    fs.readFile(
        getFilePath(req.url),
        (err, data) => {
            // if and error occurs while reading the file
            if (err) {
                console.log('An error has occured:');
                console.log(err);
            }

            // write the response header
            res.writeHead(200, { 'Content-Type': getContentType(req.url) });

            // write the data in the file
            res.write(data);
            res.end();
        }
    );

}).listen(8000);