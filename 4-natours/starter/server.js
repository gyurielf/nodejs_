const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });
const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    userFindAndModify: false,
    useUnifiedTopology: true
  })
  .then(() => console.log('DB Connection successful!'));

console.log(process.env.NODE_ENV);
// SERVER
// Port from Environment variables process - config.env file, OR 3000.
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
