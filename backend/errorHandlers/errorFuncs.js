function logErrors(error, req, res, next) {
    console.error(error.stack)
    next(error)
}

function clientErrorHandler (error, req, res, next) {
    if (req.xhr) {
      res.status(500).send({ error: 'Something failed!' })
    } else {
      next(error)
    }
}

function errorHandler (error, req, res, next) {
    res.status(500)
    res.send(`${error.name}: ${error.message} <br> <br> ${JSON.stringify(error)}`)
}

export { logErrors, clientErrorHandler, errorHandler}