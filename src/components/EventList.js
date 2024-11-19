import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function EventList() {
  const [events, setEvents] = useState([]); // 存储所有事件

  useEffect(() => {
    const fetchEvents = async () => {
      const token = localStorage.getItem('token'); // 从localStorage获取令牌
      try {
        const response = await axios.get('http://localhost:5000/events', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setEvents(response.data); // 存储所有事件
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
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

  return (
    <div>
      <h1>Upcoming Events</h1>
      <ul>
        {events.map(event => (
          <li key={event._id}>
            <h2><Link to={`/events/${event._id}`}>{event.name}</Link></h2>
            <p>{event.description}</p>
            <p>{Date(event.date)} at {event.time} in {event.location}</p>
            <p>Weather: {event.weather}</p>
            <p>Created by: {event.createdBy ? event.createdBy.username : 'Unknown'}</p> {/* 显示创建者 */}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default EventList;