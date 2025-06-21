module.exports = function (req, res, next) {
  if (req.params.id) {
    const numericId = Number(req.params.id);
    req.params.id = numericId.toString(); // Convert back to string for json-server
  }
  next();
};
