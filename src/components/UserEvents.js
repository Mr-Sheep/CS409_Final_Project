import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

function UserEvents() {
  const [events, setEvents] = useState([]); // 存储当前用户创建的事件
  const [editingEvent, setEditingEvent] = useState(null); // 存储当前正在编辑的事件
  const [editingEventDetails, setEditingEventDetails] = useState({
    name: '',
    description: '',
    date: '',
    time: '',
    location: '',
    weather: ''
  }); // 存储正在编辑的事件的详细信息
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserEvents = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get('http://localhost:5000/events/by/:username', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setEvents(response.data);
      } catch (error) {
        console.error('Error fetching user events:', error);
      }
    };

    fetchUserEvents();
  }, []);

  const handleDelete = async (eventId) => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.delete(`http://localhost:5000/events/${eventId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.status === 200) {
        const updatedEvents = events.filter(event => event._id !== eventId);
        setEvents(updatedEvents);
      }
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  const handleEdit = (event) => {
    // 确保 event.date 是一个 Date 对象
    const date = typeof event.date === 'string' ? new Date(event.date) : event.date;
  
    setEditingEvent(event);
    setEditingEventDetails({
      name: event.name,
      description: event.description,
      date: date.toISOString().split('T')[0],
      time: date.toISOString().split('T')[1].split('.')[0],
      location: event.location,
      weather: event.weather
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const response = await axios.put(`http://localhost:5000/events/${editingEvent._id}`, {
        ...editingEventDetails,
        createdBy: editingEvent.createdBy
      }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.status === 200) {
        const updatedEvents = events.map(event => 
          event._id === editingEvent._id ? { ...event, ...editingEventDetails } : event
        );
        setEvents(updatedEvents);
        setEditingEvent(null); // 清除正在编辑的事件
      }
    } catch (error) {
      console.error('Error updating event:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditingEventDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div>
      <h1>My Events</h1>
      <ul>
        {events.map(event => (
          <li key={event._id}>
            <h2><Link to={`/events/${event._id}`}>{event.name}</Link></h2>
            <p>{event.description}</p>
            <p>{Date(event.date)} at {event.time} in {event.location}</p>
            <p>Weather: {event.weather}</p>
            <p>Created by: {event.createdBy ? event.createdBy.username : 'Unknown'}</p>
            <button onClick={() => handleDelete(event._id)}>Delete Event</button>
            <button onClick={() => handleEdit(event)}>Edit Event</button>
            {editingEvent && editingEvent._id === event._id && (
              <form onSubmit={handleUpdate}>
                <input type="text" name="name" value={editingEventDetails.name} onChange={handleChange} />
                <input type="text" name="description" value={editingEventDetails.description} onChange={handleChange} />
                <input type="date" name="date" value={editingEventDetails.date} onChange={handleChange} />
                <input type="time" name="time" value={editingEventDetails.time} onChange={handleChange} />
                <input type="text" name="location" value={editingEventDetails.location} onChange={handleChange} />
                <input type="text" name="weather" value={editingEventDetails.weather} onChange={handleChange} />
                <button type="submit">Update Event</button>
              </form>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UserEvents;