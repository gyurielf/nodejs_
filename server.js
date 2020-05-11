const mongoose = require('mongoose');
const dotenv = require('dotenv');

//122. viceo -- SYNC --
process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! Shutting down...');
  console.log(err.name, err.message);
  if (process.env.NODE_ENV === 'development') {
    console.log(err);
  }
  process.exit(1);
});

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
    useFindAndModify: false,
    useUnifiedTopology: true
  })
  .then(() => console.log('Database connection successful'));
// unhandled rejections error handlin >> way 1 - not complicated app
// .catch((err) => console.log('DB Connection failed.'));

console.log(process.env.NODE_ENV);
// SERVER
// Port from Environment variables process - config.env file, OR 3000.
const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  console.log(`App running on port ${port}`);
});

// 121. video -- ASYNC
process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('UNHANDLED REJECTION! Shutting down...');
  // console.log(err);
  // Gracefully shutdown before process exit.
  server.close(() => {
    // 1 = uncaught exception, 0 = success
    process.exit(1);
  });
});
