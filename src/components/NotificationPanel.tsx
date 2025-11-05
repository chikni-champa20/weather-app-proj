import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  X, 
  Thermometer, 
  ThermometerSun, 
  ThermometerSnowflake,
  Umbrella, 
  CloudRain, 
  Wind, 
  Droplets, 
  EyeOff, 
  Shirt, 
  TrendingUp,
  AlertTriangle,
  Info,
  AlertCircle
} from 'lucide-react';
import { Notification, notificationService } from '../services/notificationService';
import { WeatherData, ForecastData } from '../types/weather';

interface NotificationPanelProps {
  weatherData: WeatherData | null;
  forecastData: ForecastData[];
  isOpen: boolean;
  onClose: () => void;
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({
  weatherData,
  forecastData,
  isOpen,
  onClose
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (weatherData && forecastData.length > 0) {
      const newNotifications = notificationService.analyzeWeatherData(weatherData, forecastData);
      setNotifications(newNotifications);
      setUnreadCount(newNotifications.length);
    }
  }, [weatherData, forecastData]);

  const dismissNotification = (id: string) => {
    notificationService.dismissNotification(id);
    setNotifications(prev => prev.filter(n => n.id !== id));
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const clearAllNotifications = () => {
    notificationService.clearAllNotifications();
    setNotifications([]);
    setUnreadCount(0);
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'alert':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-500" />;
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getTypeIcon = (type: string, icon: string) => {
    switch (icon) {
      case 'thermometer-sun':
        return <ThermometerSun className="w-5 h-5" />;
      case 'thermometer-snowflake':
        return <ThermometerSnowflake className="w-5 h-5" />;
      case 'thermometer':
        return <Thermometer className="w-5 h-5" />;
      case 'umbrella':
        return <Umbrella className="w-5 h-5" />;
      case 'cloud-rain':
        return <CloudRain className="w-5 h-5" />;
      case 'wind':
        return <Wind className="w-5 h-5" />;
      case 'droplets':
        return <Droplets className="w-5 h-5" />;
      case 'eye-off':
        return <EyeOff className="w-5 h-5" />;
      case 'shirt':
        return <Shirt className="w-5 h-5" />;
      case 'trending-up':
        return <TrendingUp className="w-5 h-5" />;
      default:
        return <Bell className="w-5 h-5" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'alert':
        return 'border-red-500/20 bg-red-500/10';
      case 'warning':
        return 'border-yellow-500/20 bg-yellow-500/10';
      case 'info':
        return 'border-blue-500/20 bg-blue-500/10';
      default:
        return 'border-blue-500/20 bg-blue-500/10';
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <Bell className="w-6 h-6 text-blue-600" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Smart Notifications</h2>
              <p className="text-sm text-gray-500">
                {unreadCount} {unreadCount === 1 ? 'notification' : 'notifications'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Notifications List */}
        <div className="overflow-y-auto max-h-[60vh]">
          {notifications.length === 0 ? (
            <div className="p-8 text-center">
              <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No notifications at the moment</p>
              <p className="text-sm text-gray-400 mt-2">
                We'll notify you about important weather changes
              </p>
            </div>
          ) : (
            <div className="p-4 space-y-3">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 rounded-2xl border ${getSeverityColor(notification.severity)} transition-all hover:shadow-md`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      {getTypeIcon(notification.type, notification.icon)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-semibold text-gray-900">
                          {notification.title}
                        </h3>
                        <div className="flex items-center space-x-2">
                          {getSeverityIcon(notification.severity)}
                          <button
                            onClick={() => dismissNotification(notification.id)}
                            className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                          >
                            <X className="w-3 h-3 text-gray-400" />
                          </button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-400">
                        {formatTime(notification.timestamp)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="p-4 border-t border-gray-100">
            <button
              onClick={clearAllNotifications}
              className="w-full py-2 px-4 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-xl transition-colors"
            >
              Clear all notifications
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationPanel; 