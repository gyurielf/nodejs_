const fs = require('fs');
const http = require('http');
const url = require('url');
// const paths = require('');

///////////////////////////////
// FILES

// Blocking synchronous way
/* const textIn = fs.readFileSync('./txt/input.txt', 'utf-8');
console.log(textIn);

const textOut = `This is what we know about the avocado: ${textIn}.\nCreated on ${Date.now()}`
fs.writeFileSync('./txt/output.txt', textOut, 'utf-8');
console.log('File written!'); */


// Non-blocking synchronous way
/* fs.readFile('./txt/starta.txt', 'utf-8', (err, data1) => {
    if (err) return console.log(`ERROR, file doesn't exist or empty.`);

    fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2) => {
        console.log(data2);
        fs.readFile(`./txt/append.txt`, 'utf-8', (err, data3) => {
            console.log(data3);

            fs.writeFile(`./txt/final.txt`, `${data2}\n${data3}`, 'utf-8', err => {
                console.log(`Your file has been written.`);
            });
        });
    });
});

console.log('Will read file!'); */

/////////////////////////////
/// SERVER
// const templateOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const templateCards = fs.readFileSync(`${__dirname}/templates/template-cards.html`, 'utf-8');
const templateProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');


const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

const server = http.createServer((req, res) => {
    const pathName = req.url;

    // HOME PAGE
    if (pathName === '/') {
        res.end('HOME');
        
        // OVERVIEW PAGE
    } else if (pathName === '/overview') {
        res.writeHead(200, {
            'Content-type': 'text/html; charset=UTF-8'
        });
        res.end('templateOverview');

        // PRODUCT PAGE
    } else if (pathName === '/product')  {
        res.end('THIS IS THE PRODUCT');

        // API
    } else if (pathName === '/api'){
        res.writeHead(200, {'Content-type': 'application/json'});       
        res.end(data);       
        
        // NOT FOUND
    } else {
        res.writeHead(404, {
            'Content-type': 'text/html; charset=UTF-8'
        });
        res.end('<h1>Page not found!</h1>');
    }

});
server.listen(8000, '127.0.0.1', () => {
    console.log('Listening to request on port 8000');
});

 