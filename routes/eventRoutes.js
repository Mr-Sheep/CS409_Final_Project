const express = require("express");
const router = express.Router();

const User = require("../models/user");
const Event = require("../models/event");

const {
  verifyToken,
  verifyEventOwnership,
} = require("../middleware/verification");

// Create a new event
router.post("/", verifyToken, async (req, res) => {
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
router.get("/", async (req, res) => {
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
router.get("/:id", async (req, res) => {
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
router.put("/:id", async (req, res) => {
  const { name, date, location_note, location, description } = req.body;

  try {
    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      { name, description, date, location_note, location },
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
router.delete("/:id", verifyToken, verifyEventOwnership, async (req, res) => {
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
});

// Show participants
router.get("/:id/participants", verifyToken, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate(
      "participants",
      "username"
    );

    if (!event) {
      return res.status(404).json({
        image: "https://http.cat/images/404.jpg",
        error: "Event not found",
      });
    }

    console.log(`Fetching participants for ${event}`);
    // console.log(event.participants);

    const participants = event.participants || [];
    // console.log(participants);

    res.status(200).json(participants);
  } catch (error) {
    res.status(500).json({
      image: "https://http.cat/images/500.jpg",
      error: "Failed to delete event",
      errorMessage: error.message,
    });
  }
});

module.exports = router;
