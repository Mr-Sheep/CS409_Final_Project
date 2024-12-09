const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Event = require("../models/event");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const {
  verifyToken,
  verifyEventOwnership,
} = require("../middleware/verification");

// User Routes

// Register a new user
router.post("/register", async (req, res) => {
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
router.post("/login", async (req, res) => {
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

router.get("/user/profile", verifyToken, async (req, res) => {
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

router.get("/user/events", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({
        image: "https://http.cat/images/404.jpg",
        error: "User not found",
      });
    }
    console.log(`attempting to get event list for ${user.username}`);

    const events = await Event.find({ creator: user._id });
    res.status(200).json(events);
  } catch (e) {
    res.status(500).json({
      image: "https://http.cat/images/500.jpg",
      error: `failed to get events with error ${e}`,
      errorMessage: e.message,
    });
  }
});

router.post("/user/join/:event", verifyToken, async (req, res) => {
  const { event } = req.params;

  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        image: "https://http.cat/images/404.jpg",
        error: "User not found",
      });
    }

    console.log(`user ${user.username} is attempting to join event: ${event}`);

    const eventLookup = await Event.findById(event);

    if (!eventLookup) {
      return res.status(404).json({
        image: "https://http.cat/images/404.jpg",
        error: "Event not found",
      });
    }

    // console.log(event);

    if (user.joined_event.includes(event)) {
      return res.status(400).json({
        image: "https://http.cat/images/400.jpg",
        error: "User has already joined this event",
      });
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      event,
      { $addToSet: { participants: req.userId } },
      { new: true }
    ).populate("participants", "username");

    // console.log("updated: ", updatedEvent.participants);

    await User.findByIdAndUpdate(
      req.userId,
      {
        $addToSet: { joined_event: event },
      },
      { new: true }
    );

    res.status(200).json({
      image: "https://http.cat/images/200.jpg",
      message: "Successfully joined event",
    });
  } catch (e) {
    res.status(500).json({
      image: "https://http.cat/images/500.jpg",
      error: `failed to get events with error ${e}`,
      errorMessage: e.message,
    });
  }
});

router.post("/user/leave/:event", verifyToken, async (req, res) => {
  const { event } = req.params;

  try {
    const user = await User.findById(req.userId);
    console.log(`user ${user.username} is attempting to leave event: ${event}`);

    if (!user) {
      return res.status(404).json({
        image: "https://http.cat/images/404.jpg",
        error: "User not found",
      });
    }
    const eventLookup = await Event.findById(event);

    if (!eventLookup) {
      return res.status(404).json({
        image: "https://http.cat/images/404.jpg",
        error: "Event not found",
      });
    }

    if (!user.joined_event.includes(event)) {
      return res.status(400).json({
        image: "https://http.cat/images/400.jpg",
        error: "User is not in this event",
      });
    }

    await Event.findByIdAndUpdate(
      event,
      {
        $pull: { participants: req.userId },
      },
      { new: true }
    );

    await User.findByIdAndUpdate(
      req.userId,
      {
        $pull: { joined_event: event },
      },
      { new: true }
    );

    res.status(200).json({
      image: "https://http.cat/images/200.jpg",
      message: "Successfully left event",
    });
  } catch (e) {
    res.status(500).json({
      image: "https://http.cat/images/500.jpg",
      error: `failed to get events with error ${e}`,
      errorMessage: e.message,
    });
  }
});

router.get("/user/events/joined", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate("joined_event");

    if (!user) {
      return res.status(404).json({
        image: "https://http.cat/images/404.jpg",
        error: "User not found",
      });
    }

    res.status(200).json(user.joined_event || []);
  } catch (e) {
    res.status(500).json({
      image: "https://http.cat/images/500.jpg",
      error: `Failed to get joined events with error ${e}`,
      errorMessage: e.message,
    });
  }
});

router.get("/user/event/:eventid", verifyToken, async (req, res) => {
  const { eventid } = req.params;
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        image: "https://http.cat/images/404.jpg",
        error: "User not found",
      });
    }

    if (!user.joined_event.includes(eventid)) {
      return res.status(200).json({
        joined: false,
      });
    }

    res.status(200).json({
      joined: true,
    });
  } catch (e) {
    res.status(500).json({
      image: "https://http.cat/images/500.jpg",
      error: `Failed to get joined events with error ${e}`,
      errorMessage: e.message,
    });
  }
});

module.exports = router;
