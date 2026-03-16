export function errorHandler(err, req, res, next) {
  console.error('[KidQuest Error]', err.message);
  const status = err.status || 500;
  res.status(status).json({
    error: err.code || 'internal_error',
    message: err.message || 'Something went wrong',
  });
}
