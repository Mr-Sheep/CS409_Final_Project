import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function EventDetail() {
  const [event, setEvent] = useState(null);
  const { id } = useParams(); // 使用react-router的useParams钩子获取路由参数

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/events/${id}`);
        setEvent(response.data);
      } catch (error) {
        console.error('Error fetching event:', error);
      }
    };

    fetchEvent();
  }, [id]);

  if (!event) return <div>Loading...</div>;

  return (
    <div>
      <h2>{event.name}</h2>
      <p>{event.description}</p>
      <p>{Date(event.date)} at {event.time} in {event.location}</p>
      <p>Weather: {event.weather}</p>
      <p>Created by: {event.createdBy ? event.createdBy.username : 'Unknown'}</p> {/* 显示创建者 */}
    </div>
  );
}

export default EventDetail;