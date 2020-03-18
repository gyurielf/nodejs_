const EventEmitter = require('events');
const http = require('http');

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
  console.log(`There are now ${stock} items left in stock.`);
});

myEmitter.emit('newSale', 5);

////////////////////////////////////////

const server = http.createServer();

server.on('request', (req, res) => {
  console.log(req.url);
  console.log('Request received!');
  res.end('Request received!');
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
