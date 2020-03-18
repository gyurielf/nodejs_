const http = require('http');
const url = require('url');
const server = http.createServer();

server.on('request', (req, res) => {
  const { query, pathname } = url.parse(req.url, true);
  if (pathname === '/') {
    console.log('Request received', Date.now());
    res.end('Request received');
  }
});

server.listen(8000, '127.0.0.1', () => {
  console.log('Listening to request on port 8000');
});
