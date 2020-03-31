/** Try-catch egyszerűsítés:
 * Létrehozok egy catchAsync nevű funkciót, amit hozzárendelek a createTour handlerhez, így amikor az lefut, az abból származó,
 * req,res,next paraméterek elérhetővé válnak és amennyiben error, akkor igrik is a catch fázisba.
 * */
module.exports = (catchAsync) => {
  return (req, res, next) => {
    catchAsync(req, res, next).catch(next);
  };
};
