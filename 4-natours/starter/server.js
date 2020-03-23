const app = require('./app');

// SERVER
const port = 8000;
app.listen(port, () => {
  console.log(`Appp running on port ${port}`);
});