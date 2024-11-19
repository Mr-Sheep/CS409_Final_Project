// src/components/EventForm.js
import React, { useState } from 'react';
import axios from 'axios';

function EventForm() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [weather, setWeather] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token'); // 从localStorage获取令牌
    try {
      const newEvent = await axios.post('http://localhost:5000/events', {
        name,
        description,
        date,
        time,
        location,
        weather
      }, {
        headers: { 'Authorization': `Bearer ${token}` } // 在请求头中发送令牌
      });
      alert('Event created successfully!');
      window.location.href = '/'; // Redirect to the Event List page
    } catch (error) {
      console.error('Error creating event:', error);
      alert('Failed to create event.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create New Event</h2>
      <div>
        <label>Name:</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div>
        <label>Description:</label>
        <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>
      <div>
        <label>Date:</label>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      </div>
      <div>
        <label>Time:</label>
        <input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
      </div>
      <div>
        <label>Location:</label>
        <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} />
      </div>
      <div>
        <label>Weather:</label>
        <input type="text" value={weather} onChange={(e) => setWeather(e.target.value)} />
      </div>
      <button type="submit">Create Event</button>
    </form>
  );
}

export default EventForm;