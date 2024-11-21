const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(bodyParser.json());
app.use(
  cors({
    origin: [
      "https://cs-409-final-project.vercel.app",
      "http://localhost:3000",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

mongoose.connect(
  "mongodb+srv://xy63:BpbJQKcy1HhArvFU@cluster0.8zmyc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0&ssl=true"
);

mongoose.connection.on("connected", () =>
  console.log("\nConnected to MongoDB\n")
);

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

// Schemas and Models

// User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});
const User = mongoose.model("User", userSchema);

// Event Schema
const eventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  location: {
    address: { type: String, required: true },
    full_address: { type: String, required: true, default: "" },
    latitude: { type: Number, required: true, default: 0 },
    longitude: { type: Number, required: true, default: 0 },
    mapbox_id: { type: String, required: true, default: "" },
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  creatorUsername: {
    type: String,
    required: true,
  },
});
const Event = mongoose.model("Event", eventSchema);

// Routes

// User Routes

// Register a new user
app.post("/api/register", async (req, res) => {
  const { username, password } = req.body;
  const saltRounds = 13;

  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();
    res.status(201).json({
      image: "https://http.cat/images/201.jpg",
      message: "User registered successfully",
    });
  } catch (error) {
    res.status(500).json({
      image: "https://http.cat/images/500.jpg",
      error: "Failed to register user",
      errorMessage: error.message,
    });
  }
});

// Login a user
// https://stackoverflow.com/questions/31687442/where-do-i-need-to-use-jwt
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    console.log(`[Login]: request from ${username}`);
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({
        image: "https://http.cat/images/404.jpg",
        error: "User not found",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        image: "https://http.cat/images/401.jpg",
        error: "Invalid credentials",
      });
    }

    const token = jwt.sign({ id: user._id }, "placeholder", {
      expiresIn: "1h",
    });
    res.json({
      message: `[Login] User: ${user._id} successful`,
      token,
      username: user.username,
    });
  } catch (error) {
    res.status(500).json({
      image: "https://http.cat/images/500.jpg",
      error: "Login failed",
      errorMessage: error.message,
    });
  }
});

// Event Routes

// Create a new event
app.post("/api/events", verifyToken, async (req, res) => {
  const { name, description, date, location } = req.body;

  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        image: "https://http.cat/images/404.jpg",
        error: "User not found",
      });
    }

    console.log(`[Event]: creating event for ${req.userId}`);

    const newEvent = new Event({
      name,
      description,
      date,
      location,
      creator: req.userId,
      creatorUsername: user.username,
    });
    // console.log(newEvent);
    await newEvent.save();
    console.log(
      `[Event]: Event ${name} (id: ${newEvent._id}) by ${req.userId} created`
    );
    res.status(201).json({
      image: "https://http.cat/images/201.jpg",
      message: "event successfully created",
      data: newEvent,
    });
  } catch (error) {
    res.status(500).json({
      image: "https://http.cat/images/500.jpg",
      error: "Failed to create event",
      errorMessage: error.message,
    });
    console.log(error.message);
  }
});

// Get all events
app.get("/api/events", async (req, res) => {
  try {
    const events = await Event.find();
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({
      image: "https://http.cat/images/500.jpg",
      error: "Failed to fetch events",
      errorMessage: error.message,
    });
  }
});

// Get a specific event by ID
app.get("/api/events/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({
        image: "https://http.cat/images/404.jpg",
        error: "Event not found",
      });
    }

    res.json(event);
  } catch (error) {
    res.status(500).json({
      image: "https://http.cat/images/500.jpg",
      error: "Failed to fetch event",
      errorMessage: error.message,
    });
  }
});

// Update an event
app.put("/api/events/:id", async (req, res) => {
  const { name, date, location, description } = req.body;

  try {
    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      { name, description, date, location },
      { new: true }
    );
    if (!updatedEvent) {
      return res.status(404).json({
        image: "https://http.cat/images/404.jpg",
        error: "Event not found",
      });
    }
    res.json(updatedEvent);
  } catch (error) {
    res.status(500).json({
      image: "https://http.cat/images/500.jpg",
      error: "Failed to update event",
      errorMessage: error.message,
    });
  }
});

// Delete an event
app.delete(
  "/api/events/:id",
  verifyToken,
  verifyEventOwnership,
  async (req, res) => {
    try {
      const deletedEvent = await Event.findByIdAndDelete(req.params.id);
      if (!deletedEvent) {
        return res.status(404).json({
          image: "https://http.cat/images/404.jpg",
          error: "Event not found",
        });
      }
      res.json({ message: "Event deleted successfully" });
    } catch (error) {
      res.status(500).json({
        image: "https://http.cat/images/500.jpg",
        error: "Failed to delete event",
        errorMessage: error.message,
      });
    }
  }
);

app.get("/api/events/user/:username", async (req, res) => {
  const { username } = req.params;
  try {
    console.log(`attempting to get event list for ${username}`);
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({
        image: "https://http.cat/images/404.jpg",
        error: "User not found",
      });
    }
    const events = await Event.find({ creator: user._id });
    res.status(200).json(events);
  } catch (e) {
    res.status(500).json({
      image: "https://http.cat/images/500.jpg",
      error: `failed to get events with error ${e}`,
      errorMessage: error.message,
    });
  }
});

app.get("/api/user/profile", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({
        image: "https://http.cat/images/404.jpg",
        error: "User not found",
      });
    }
    res.json({
      username: user.username,
      _id: user._id,
    });
  } catch (error) {
    res.status(500).json({
      image: "https://http.cat/images/500.jpg",
      error: "Failed to fetch user profile",
      errorMessage: error.message,
    });
  }
});

// Start Server
app.listen(port, () => console.log(`Server running on port ${port}`));
