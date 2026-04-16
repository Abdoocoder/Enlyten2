import React from 'react';
import { useTranslation } from 'react-i18next';
import './Notifications.css';
import Card from '../components/UI/Card/Card';
import Button from '../components/UI/Button/Button';

const Notifications = () => {
  const { t } = useTranslation();

  const notifications = [
    { id: 1, type: 'appointment', titleKey: 'n1Title', messageKey: 'n1Message', timeKey: 'n1Time', unread: true },
    { id: 2, type: 'offer',       titleKey: 'n2Title', messageKey: 'n2Message', timeKey: 'n2Time', unread: false },
    { id: 3, type: 'system',      titleKey: 'n3Title', messageKey: 'n3Message', timeKey: 'n3Time', unread: false },
  ];

  return (
    <div className="notifications-page page-container">
      <header className="notifications-header section">
        <h1 className="headline-medium">{t('notifications.title')}</h1>
        <p className="body-large">{t('notifications.subtitle')}</p>
      </header>

      <div className="notifications-list section">
        {notifications.map(n => (
          <Card key={n.id} variant={n.unread ? 'white' : 'tonal'} className={`notification-item ${n.unread ? 'unread' : ''}`}>
            <div className="notification-content">
              <div className="notification-main">
                <span className={`type-icon ${n.type}`}></span>
                <div className="notification-text">
                  <h3 className="headline-small">{t(`notifications.${n.titleKey}`)}</h3>
                  <p className="body-medium">{t(`notifications.${n.messageKey}`)}</p>
                </div>
              </div>
              <div className="notification-meta">
                <span className="body-small time-stamp">{t(`notifications.${n.timeKey}`)}</span>
                {n.unread && <span className="unread-dot"></span>}
              </div>
            </div>
            <div className="notification-actions">
              <Button variant="secondary">{t('notifications.markRead')}</Button>
              <Button variant="primary">{t('notifications.viewDetails')}</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Notifications;
