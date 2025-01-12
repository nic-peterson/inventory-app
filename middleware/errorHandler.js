const errorHandler = (err, req, res, next) => {
  console.error(err);

  // Handle specific PostgreSQL errors
  switch (err.code) {
    case "23503": // Foreign key violation
      return res.status(400).json({
        message: "Referenced record does not exist",
        detail: err.detail,
      });

    case "23505": // Unique violation
      return res.status(400).json({
        message: "Record already exists",
        detail: err.detail,
      });

    case "23502": // Not null violation
      return res.status(400).json({
        message: "Required field missing",
        detail: err.detail,
      });

    case "VALIDATION_ERROR": // Custom validation error
      return res.status(400).json({
        message: err.message,
        details: err.details,
      });

    default:
      return res.status(500).json({
        message: "An unexpected error occurred",
        detail:
          process.env.NODE_ENV === "development" ? err.message : undefined,
      });
  }
};

module.exports = errorHandler;
