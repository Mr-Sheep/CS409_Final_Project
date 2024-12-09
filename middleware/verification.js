const jwt = require("jsonwebtoken");
const Event = require("../models/event");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({
      image: "https://http.cat/images/401.jpg",
      error: "No token provided",
    });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, "placeholder");
    req.userId = decoded.id;
    next();
  } catch (error) {
    return res.status(401).json({
      image: "https://http.cat/images/401.jpg",
      error: "Invalid token",
    });
  }
};

const verifyEventOwnership = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({
        image: "https://http.cat/images/404.jpg",
        error: "Event not found",
      });
    }

    if (event.creator.toString() !== req.userId) {
      return res.status(403).json({
        image: "https://http.cat/images/403.jpg",
        error: "Unauthorized",
      });
    }

    req.event = event;
    next();
  } catch (error) {
    res.status(500).json({
      image: "https://http.cat/images/500.jpg",
      error: "Failed to verify event ownership",
      errorMessage: error.message,
    });
  }
};

module.exports = { verifyToken, verifyEventOwnership };
