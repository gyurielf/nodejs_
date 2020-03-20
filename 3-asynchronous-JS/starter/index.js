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

// ASYNC / AWAIT -- SYNTATIC SUGAR FOR PROMISES
const getDogPic = async () => {
  try {
    const data = await readFilePro(`${__dirname}/dog.txt`);
    console.log(`Breed: ${data}`);

    const res1Pro = superagent.get(
      `https://dog.ceo/api/breed/${data}/images/random`
    );
    const res2Pro = superagent.get(
      `https://dog.ceo/api/breed/${data}/images/random`
    );
    const res3Pro = superagent.get(
      `https://dog.ceo/api/breed/${data}/images/random`
    );
      // Egyszerre több PROMISE fut egyidejűjeg, amiknek az eredménye az all változóban fog tárolódni, ha teljesül.
      // Aztán azon azon végigmegyek és minden eleméből kimentem a szükséges adatot(IMG url-je) az imgs változóba.
    const all = await Promise.all([res1Pro, res2Pro, res3Pro]);
    const imgs = all.map(el => el.body.message);
    console.log(imgs);

      // A fájl írásakor hozzácsatolok egy plusz \r\n-t a változóhoz, aminek a ttartalmát ki akarom íratni a fájlba, 
      // ezért az imgs változó tartalma (tömb elemjei), minden egyes eleme új sorba kerül.
    await writeFilePro('dog-img.txt', imgs.join('\r\n'));
    console.log('Random dog image saved to file!');
  } catch (err) {
    err.message ? console.log(err.message) : console.log(err);
    throw err;
  }
  return '2: READY!';
};

(async () => {
  try {
    console.log('1: will get dog pics!');
    const x = await getDogPic();
    console.log(x);
    console.log('3: Done geting dog pics!');
  } catch (err) {
    console.log('Error!');
  }
})();

/* 
console.log('1: will get dog pics!');
// Nem fog értéket kapni az x, mivel a háttérben fut a kód, így az X még nem kap értéket.
// const x = getDogPic();
// console.log(x);
getDogPic().then(x => {
  console.log(x);
  console.log('3: Done geting dog pics!');
}).catch(err => {
  console.log('Error!');
})
 */

// readFilePro(`${__dirname}/dog.txt`)
//   .then(data => {
//     console.log(`Breed: ${data}`);

//     return superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);
//   })
//   .then(res => {
//     console.log(res.body.message);

//     return writeFilePro('dog-img.txt', res.body.message);
//   })

//   .then(() => {
//     console.log('Random dog image saved to file!');
//   })
//   .catch(err => {
//     err.message ? console.log(err.message) : console.log(err);
//   });
