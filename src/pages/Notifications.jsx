import React from 'react';
import './Notifications.css';
import Card from '../components/UI/Card/Card';
import Button from '../components/UI/Button/Button';

const Notifications = () => {
  const notifications = [
    {
      id: 1,
      type: 'appointment',
      title: 'Appointment Reminder',
      message: 'Your Laser Genesis treatment is tomorrow at 10:00 AM.',
      time: '2 hours ago',
      unread: true
    },
    {
      id: 2,
      type: 'offer',
      title: 'Exclusive Spring Offer',
      message: 'Enjoy 20% off all chemical peels this month. Book now to secure your glow.',
      time: '1 day ago',
      unread: false
    },
    {
      id: 3,
      type: 'system',
      title: 'Profile Updated',
      message: 'Your personal information has been successfully updated.',
      time: '3 days ago',
      unread: false
    }
  ];

  return (
    <div className="notifications-page page-container">
      <header className="notifications-header section">
        <h1 className="headline-medium">Notifications</h1>
        <p className="body-large">Stay updated on your treatments and exclusive offers.</p>
      </header>

      <div className="notifications-list section">
        {notifications.map(notification => (
          <Card 
            key={notification.id} 
            variant={notification.unread ? 'white' : 'tonal'} 
            className={`notification-item ${notification.unread ? 'unread' : ''}`}
          >
            <div className="notification-content">
              <div className="notification-main">
                <span className={`type-icon ${notification.type}`}></span>
                <div className="notification-text">
                  <h3 className="headline-small">{notification.title}</h3>
                  <p className="body-medium">{notification.message}</p>
                </div>
              </div>
              <div className="notification-meta">
                <span className="body-small time-stamp">{notification.time}</span>
                {notification.unread && <span className="unread-dot"></span>}
              </div>
            </div>
            <div className="notification-actions">
              <Button variant="secondary">Mark as Read</Button>
              <Button variant="primary">View Details</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Notifications;
