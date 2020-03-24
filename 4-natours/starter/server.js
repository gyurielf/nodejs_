const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });
const app = require('./app');
// console.log(process.env);
// console.log(app.get('env'));

// SERVER
// Port from Environment variables process - config.env file, OR 3000.
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
