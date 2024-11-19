import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import EventList from './components/EventList';
import EventForm from './components/EventForm';
import Login from './components/Login';
import Register from './components/Register';
import EventDetail from './components/EventDetail';
import ProtectedRoute from './components/ProtectedRoute';
import UserEvents from './components/UserEvents';
import { logoutUser } from './utils/auth';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>EventLawnchair</h1>
          <nav>
            <Link to="/">Event List</Link> | 
            <Link to="/add-event">Add Event</Link> | 
            <Link to="/events/user">My Events</Link> | {/* 添加链接到用户创建的事件 */}
            <Link to="/login">Login</Link> | 
            <Link to="/register">Register</Link>
            <button onClick={logoutUser}>Logout</button>
          </nav>
        </header>
        <Routes>
          <Route path="/" element={<EventList />} />
          <Route path="/add-event" element={
            <ProtectedRoute>
              <EventForm />
            </ProtectedRoute>
          } />
          <Route path="/events/:id" element={<EventDetail />} />
          <Route path="/events/user" element={
            <ProtectedRoute>
              <UserEvents />
            </ProtectedRoute>
          } />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;









