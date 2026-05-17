import { useTranslation } from 'react-i18next';
import { useMemo, useCallback, memo } from 'react';
import './Notifications.css';
import Card from '../components/UI/Card/Card';
import Button from '../components/UI/Button/Button';

const NotificationItem = memo(({ n, onMarkRead, onViewDetails }) => {
  const { t } = useTranslation();

  return (
    <Card variant={n.unread ? 'white' : 'tonal'} className={`notification-item ${n.unread ? 'unread' : ''}`}>
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
        <Button variant="secondary" onClick={() => onMarkRead(n.id)}>{t('notifications.markRead')}</Button>
        <Button variant="primary" onClick={() => onViewDetails(n.id)}>{t('notifications.viewDetails')}</Button>
      </div>
    </Card>
  );
});

const STATIC_NOTIFICATIONS = [
  { id: 1, type: 'appointment', titleKey: 'n1Title', messageKey: 'n1Message', timeKey: 'n1Time', unread: true },
  { id: 2, type: 'offer',       titleKey: 'n2Title', messageKey: 'n2Message', timeKey: 'n2Time', unread: false },
  { id: 3, type: 'system',      titleKey: 'n3Title', messageKey: 'n3Message', timeKey: 'n3Time', unread: false },
];

const Notifications = () => {
  const { t } = useTranslation();

  const handleMarkRead = useCallback((id) => {
    // Logic for marking as read would go here
    console.log('Marking as read:', id);
  }, []);

  const handleViewDetails = useCallback((id) => {
    // Logic for viewing details would go here
    console.log('Viewing details:', id);
  }, []);

  return (
    <div className="notifications-page page-container">
      <header className="notifications-header section">
        <h1 className="headline-medium">{t('notifications.title')}</h1>
        <p className="body-large">{t('notifications.subtitle')}</p>
      </header>

      <div className="notifications-list section">
        {STATIC_NOTIFICATIONS.map(n => (
          <NotificationItem
            key={n.id}
            n={n}
            onMarkRead={handleMarkRead}
            onViewDetails={handleViewDetails}
          />
        ))}
      </div>
    </div>
  );
};

export default Notifications;
