console.log('Middleware file loaded'); // Debug on load
module.exports = function (req, res, next) {
  console.log('Middleware invoked for URL:', req.url, 'Params:', req.params);
  if (req.params.id) {
    const numericId = Number(req.params.id);
    console.log('Converting ID:', req.params.id, 'to', numericId, 'Type:', typeof numericId);
    req.params.id = numericId.toString(); // Convert back to string for json-server
  }
  next();
};
