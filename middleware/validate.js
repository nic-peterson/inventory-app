const validateBook = (req, res, next) => {
  const { title, genre_id, quantity } = req.body;
  const errors = {};

  // Required fields
  if (!title) errors.title = "Title is required";
  if (!genre_id) errors.genre_id = "Genre is required";
  if (quantity === undefined) errors.quantity = "Quantity is required";

  if (Object.keys(errors).length > 0) {
    if (req.headers.accept?.includes("application/json")) {
      return res.status(400).json({
        message: "Missing required fields",
        details: errors,
      });
    }
    return res.status(400).render("error", {
      title: "Validation Error",
      message: "Please fill in all required fields.",
    });
  }

  // Title length
  if (title.length < 1 || title.length > 255) {
    const message = "Title must be between 1 and 255 characters";
    if (req.headers.accept?.includes("application/json")) {
      return res.status(400).json({
        message: "Invalid title length",
        details: message,
      });
    }
    return res.status(400).render("error", {
      title: "Validation Error",
      message,
    });
  }

  // Quantity must be non-negative
  if (quantity < 0) {
    const message = "Quantity cannot be negative";
    if (req.headers.accept?.includes("application/json")) {
      return res.status(400).json({
        message: "Invalid quantity",
        details: message,
      });
    }
    return res.status(400).render("error", {
      title: "Validation Error",
      message,
    });
  }

  next();
};

module.exports = {
  validateBook,
};
