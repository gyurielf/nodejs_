const EventEmitter = require('events');
const http = require('http');
const url = require('url');

class Sales extends EventEmitter {
  constructor() {
    super();
  }
}

const myEmitter = new Sales();

myEmitter.on('newSale', () => {
  console.log('There was a new sale!');
  const newUser = 0;
});

myEmitter.on('newSale', () => {
  console.log(`Customer name: Jonas`);
});

myEmitter.on('newSale', stock => {
  console.log(`There are now ${stock} items left in stock.a`);
});

myEmitter.emit('newSale', 5);

////////////////////////////////////////

const server = http.createServer();

server.on('request', (req, res) => {
  const { query, pathname } = url.parse(req.url, true);
  if (pathname === '/') {
    res.writeHead(200, { 'Content-type': 'text/html; charset=UTF-8' });
    console.log('Request received', Date.now());
    res.end('Request received');
  }
  res.writeHead(404, { 'Content-type': 'text/html; charset=UTF-8' });
  res.end('<h1>not found</h1>');
});

server.on('request', (req, res) => {
  console.log('Another request received! :) ');
});

server.on('close', () => {
  console.log('Server closed!');
});

server.listen(8000, '127.0.0.1', () => {
  console.log('Waiting for request on port 8000...');
});
