const validateBook = (req, res, next) => {
  const { title, genre_id, quantity } = req.body;

  // Required fields
  if (!title || !genre_id || quantity === undefined) {
    return res.status(400).json({
      message: "Missing required fields",
      details: {
        title: !title ? "Title is required" : undefined,
        genre_id: !genre_id ? "Genre is required" : undefined,
        quantity: quantity === undefined ? "Quantity is required" : undefined,
      },
    });
  }

  // Title length
  if (title.length < 1 || title.length > 255) {
    return res.status(400).json({
      message: "Invalid title length",
      details: "Title must be between 1 and 255 characters",
    });
  }

  // Quantity must be non-negative
  if (quantity < 0) {
    return res.status(400).json({
      message: "Invalid quantity",
      details: "Quantity cannot be negative",
    });
  }

  next();
};

module.exports = {
  validateBook,
};
