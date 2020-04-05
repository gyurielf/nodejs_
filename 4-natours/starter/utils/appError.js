class AppError extends Error {
  constructor(message, statusCode) {
    super();
    this.message = message;
    this.statusCode = statusCode;
    // this.status = Statuscode converted to string, and if starts with 4, set this.status = 'fail, otherwise this.status = 'error'
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Az expressnél használatos, két bejövő adata van, ebből az egyiket az express dolgozza fel:
 * message, a másik a statusCode, amiből eldöntöm, hogy mi lesz a response statusza ( status)
 * jelen esetben eldöntöm, hogy ha 4-el kezdődik, akkor fail, ha nem akkor error.
 * @param message Define the meanful error message
 * @param statusCode HTTP status code which would be send
 */
module.exports = AppError;
