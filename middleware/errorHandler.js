function errorHandler(err, req, res, next) {
  console.error(err);

  // Set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.locals.title = "Error";

  // Render the error page
  res.status(err.status || 500);
  res.render("error", {
    title: "Error",
    message: err.message || "An unexpected error occurred",
  });
}

module.exports = errorHandler;
