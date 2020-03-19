const fs = require('fs');
const superagent = require('superagent');

// const server = require('http')
//   .createServer()
//   .listen(8000, '127.0.0.1', () => {
//     console.log('Waiting for request on port 8000...');
//   });
// const url = require('url');

// PROMISE

const dogData = fs.readFile(`${__dirname}/dog.txt`, (err, data) => {
  console.log(`Breed: ${data}`);

  superagent
    .get(`https://dog.ceo/api/breed/${data}/images/random`)
    .then(res => {
      if (err) return console.log(err.message);
      console.log(res.body.message);

      fs.writeFile('dog-img.txt', res.body.message, err => {
        if (err) return console.log(err.message);
        console.log('Random img saved to file!');
      });
    })
    .catch(err => {
      console.log(err.message);
    });
});

/* 
server.on('request', (req, res) => {
  const { query, pathname } = url.parse(req.url, true);
  if (pathname === '/' && dogData) {
    res.writeHead(200);
    res.end(`${dogData}`);
  } else {
    res.writeHead(404, { 'Content-type': 'text/html; charset=UTF-8' });
    res.end('<h1>not found</h1>');
  }
});
 */

// async function getRandomDogImg(woeid) {
//     try {
//         const result = await fetch(`https://cors-anywhere.herokuapp.com/https://dog.ceo/api/breeds/image/random`);
//         const data = await result.json();
//         return data.fs.writeFile(`${__dirname}lol.jpg`);;
//     } catch (error) {
//         console.error(error);
//     }

// }
// getRandomDogImg();

// server.listen(8000, '127.0.0.1', () => {
//     console.log('Waiting for request on port 8000...');
//   });
