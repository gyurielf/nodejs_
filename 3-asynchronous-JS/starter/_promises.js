const fs = require('fs');
const superagent = require('superagent');

// BETTER WAY - PROMISES  --- RECOMMENDED
// -- --> CALLED --> FLAT STRUCTURE OF CHAN PROMISES
const readFilePro = file => {
  return new Promise((resolve, reject) => {
    fs.readFile(file, (err, data) => {
      if (err) reject('I could not find that file.');
      resolve(data);
    });
  });
};

const writeFilePro = (file, data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(file, data, err => {
      if (err) reject(`Could not write a file`);
      resolve('success');
    });
  });
};

/* 
FONTOS!
-- Egy promise egy újabb promise-t ad vissza-- .
A Callback hel lelkerülése végett, így egy chainen érdemes végigmenni.
Az alábbi példában a következő történik:
a readFilePro promissal beolvastatom a dog.txt-filet, ha betudtam olvasni, akkor kiíratom a logba azt ami benne van,
majd egy újabb promiszt returnolok a superagent.get methoddal, ahová az első promisben kapott adatot beillesztem, mint api query értéket(labrador)
ha ez is oké, akkor kiíratom logba a hívás válaszának a tartalmát, ami jelen esetben egy kép lesz URL-je lesz és egy újabb promise-t returnolok
writeFilePro amivel már fájlba írom a kép url-jét. Amikor ez is teljesül, akkor kiírom, hogy sikerült a fájlba mentés, ha valamiért egyik sem teljesül.
akkor a Catch fog lefutni, hogy elkapjuk a hibát.
-- Tehát a trükk az, hogy mind addig egy újabb promist returnolunk vissza, then then then. ezért kód végigfut és elvégik a műveleteket.
Ha hiba van, akkor mivel a readFilePro - promise, nem teljesül, ezért az rejectelődik, amiből az következik, hogy az alábbi kódrész catch methodja fog lefutni.
 */

readFilePro(`${__dirname}/dog.txt`)
  .then(data => {
    console.log(`Breed: ${data}`);

    return superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);
  })
  .then(res => {
    console.log(res.body.message);

    return writeFilePro('dog-img.txt', res.body.message);

    /* 
    Kommentelve, mert promise-el használom, így jóval egyszerűbb.
    fs.writeFile('dog-img.txt', res.body.message, err => {
      if (err) return console.log(err.message);
      console.log('Random img saved to file!');
    }); 
    */
  })
  .then(() => {
    console.log('Random dog image saved to file!');
  })
  .catch(err => {
    err.message ? console.log(err.message) : console.log(err);
  });

// OLD WAY without promises.
/* 
fs.readFile(`${__dirname}/dog.txt`, (err, data) => {
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
*/

/* 
async function getRandomDogImg(woeid) {
    try {
        const result = await fetch(`https://cors-anywhere.herokuapp.com/https://dog.ceo/api/breeds/image/random`);
        const data = await result.json();
        return data.fs.writeFile(`${__dirname}lol.jpg`);;
    } catch (error) {
        console.error(error);
    } 


}
getRandomDogImg();
*/
