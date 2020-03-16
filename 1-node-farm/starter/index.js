const fs = require('fs');
const http = require('http');
const url = require('url');

const replaceTemplate = require('./modules/replaceTemplate');

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

const templateOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const templateCards = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');
const templateProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

const server = http.createServer((req, res) => {
    // console.log(req.url);
    const {query, pathname} = url.parse(req.url, true);
    // const pathName = req.url;

    // HOME PAGE
    if (pathname === '/') {
        res.end('HOME');
        
        // OVERVIEW PAGE
    } else if (pathname === '/overview') {
        res.writeHead(200, {
            'Content-type': 'text/html; charset=UTF-8'
        });
        /* Egy tömbbön loop-al végigmegyek. Az első el, a tömb aktuális eleme. Egy functiont (replaceTemplate) ráhívok minden elemre, 
        ahol a functionnak két argumentet adok be, a templateCards-ot (egy html oldal, a benne lévő összes tartalommal) 
        és az aktuális elemét a dataObj tömbbnek.
        Végezetül, hogy ne egy tömbböt kapjunk a cardsHtml változóba, egy nagy string-et csinálunk belőle.
        ezt úgy tudjuk megtenni, hogy a tömb végén .join('')-t használunk ez az összes ide tartozó elemet joinolni foja egy stringbe.
         */
        const cardsHtml = dataObj.map( el => replaceTemplate(templateCards, el)).join('');

        /* ITT a templateOverview (itt most egy html file) replacelem a {%PRODUCT_CARDS%}-ot (ez a productok helye, ahová ki kel lrajzolni a productokat.) */
        const output = templateOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);

        res.end(output);

        // PRODUCT PAGE
    } else if (pathname === '/product')  {
        res.writeHead(200, {'Content-type': 'text/html; charset=UTF-8'});
        const product = dataObj[query.id];
        const output = replaceTemplate(templateProduct, product);
        // console.log(query);        
        res.end(output);

        // API
    } else if (pathname === '/api'){
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

 