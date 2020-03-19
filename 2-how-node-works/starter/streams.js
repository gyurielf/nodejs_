// const EventEmitter = require('events');
const fs = require('fs');
const server = require('http').createServer();
const url = require('url');
const EventEmitter = require('events');

server.on('request', (req, res) => {
  // Solution #1 -- Read the file into a variable, and then once that's done, send it to the client.
  // Note recommended -- just locally or ourselves.
  /* 
  const { query, pathname } = url.parse(req.url, true);
  if (pathname === '/') {
    // res.writeHead(200, { 'Content-type': 'text/html; charset=UTF-8' });
    fs.readFile(`./test-file.txt`, (err, data) => {
      res.writeHead(200);
      if (err) console.log(err);
      res.end(data);
    });
  } else {
    res.writeHead(404, { 'Content-type': 'text/html; charset=UTF-8' });
    res.end('<h1>not found</h1>');
  } 
  */

  // Solution #2 -- Not need to read the data from the file into a variable.
  /* 
  const readable = fs.createReadStream('test-file.txt');
  const { query, pathname } = url.parse(req.url, true);
  if (pathname === '/') {
    // res.writeHead(200);
    readable.on('data', chunk => {
      res.write(chunk);
    });
    readable.on('end', () => {
      res.end();
    });
    readable.on('error', err => {
      console.log(err);
      res.statusCode = 500;
      res.end('File not found');
    });
  } else {
    res.writeHead(404, { 'Content-type': 'text/html; charset=UTF-8' });
    res.end('<h1>not found</h1>');
  } 
  */

    // Solution #3 -- avoid backpressure - PIPE

  const readable = fs.createReadStream('test-file.txt');
  // readableSource.pipe(writeableDestination)


  const { query, pathname } = url.parse(req.url, true);
  if (pathname === '/') {
    // res.writeHead(200);
    readable.pipe(res);
    
    readable.on('error', err => {
      console.log(err);
      res.statusCode = 500;
      res.end('File not found');
    });
    
  } else {
    res.writeHead(404, { 'Content-type': 'text/html; charset=UTF-8' });
    res.end('<h1>not found</h1>');
  } 
});

server.listen(8000, '127.0.0.1', () => {
  console.log('Waiting for request on port 8000...');
});
