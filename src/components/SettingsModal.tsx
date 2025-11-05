import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  X, 
  Thermometer, 
  Wind, 
  Clock, 
  Bell,
  Sun,
  Moon,
  Check
} from 'lucide-react';
import { UserPreferences, notificationService } from '../services/notificationService';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const [preferences, setPreferences] = useState<UserPreferences>({
    temperatureUnit: 'celsius',
    windUnit: 'kmh',
    timeFormat: '12',
    notifications: {
      temperature: true,
      precipitation: true,
      wind: true,
      comfort: true
    },
    notificationTiming: 'both'
  });

  useEffect(() => {
    if (isOpen) {
      const savedPreferences = notificationService.loadPreferences();
      setPreferences(savedPreferences);
    }
  }, [isOpen]);

  const handlePreferenceChange = (key: keyof UserPreferences, value: any) => {
    const newPreferences = { ...preferences, [key]: value };
    setPreferences(newPreferences);
    notificationService.savePreferences(newPreferences);
  };

  const handleNotificationToggle = (type: keyof UserPreferences['notifications']) => {
    const newNotifications = {
      ...preferences.notifications,
      [type]: !preferences.notifications[type]
    };
    handlePreferenceChange('notifications', newNotifications);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <Settings className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Settings</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Settings Content */}
        <div className="overflow-y-auto max-h-[70vh] p-6 space-y-6">
          {/* Units Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Units</h3>
            <div className="space-y-4">
              {/* Temperature Unit */}
              <div>
                <label className="flex items-center space-x-3 text-sm font-medium text-gray-700 mb-2">
                  <Thermometer className="w-4 h-4" />
                  <span>Temperature Unit</span>
                </label>
                <div className="flex space-x-2">
                  {(['celsius', 'fahrenheit'] as const).map((unit) => (
                    <button
                      key={unit}
                      onClick={() => handlePreferenceChange('temperatureUnit', unit)}
                      className={`flex-1 py-2 px-4 rounded-xl border transition-all ${
                        preferences.temperatureUnit === unit
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      {unit === 'celsius' ? '°C' : '°F'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Wind Unit */}
              <div>
                <label className="flex items-center space-x-3 text-sm font-medium text-gray-700 mb-2">
                  <Wind className="w-4 h-4" />
                  <span>Wind Speed Unit</span>
                </label>
                <div className="flex space-x-2">
                  {(['kmh', 'mph'] as const).map((unit) => (
                    <button
                      key={unit}
                      onClick={() => handlePreferenceChange('windUnit', unit)}
                      className={`flex-1 py-2 px-4 rounded-xl border transition-all ${
                        preferences.windUnit === unit
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      {unit.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Format */}
              <div>
                <label className="flex items-center space-x-3 text-sm font-medium text-gray-700 mb-2">
                  <Clock className="w-4 h-4" />
                  <span>Time Format</span>
                </label>
                <div className="flex space-x-2">
                  {(['12', '24'] as const).map((format) => (
                    <button
                      key={format}
                      onClick={() => handlePreferenceChange('timeFormat', format)}
                      className={`flex-1 py-2 px-4 rounded-xl border transition-all ${
                        preferences.timeFormat === format
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      {format}-hour
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Notifications Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Notifications</h3>
            <div className="space-y-4">
              {/* Notification Types */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-3 block">
                  Notification Types
                </label>
                <div className="space-y-3">
                  {([
                    { key: 'temperature', label: 'Temperature Alerts', icon: Thermometer },
                    { key: 'precipitation', label: 'Precipitation Alerts', icon: Wind },
                    { key: 'wind', label: 'Wind Alerts', icon: Wind },
                    { key: 'comfort', label: 'Comfort Alerts', icon: Bell }
                  ] as const).map(({ key, label, icon: Icon }) => (
                    <div
                      key={key}
                      className="flex items-center justify-between p-3 rounded-xl border border-gray-200 hover:border-gray-300 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <Icon className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-700">{label}</span>
                      </div>
                      <button
                        onClick={() => handleNotificationToggle(key)}
                        className={`w-6 h-6 rounded-full border-2 transition-all ${
                          preferences.notifications[key]
                            ? 'border-blue-500 bg-blue-500'
                            : 'border-gray-300'
                        }`}
                      >
                        {preferences.notifications[key] && (
                          <Check className="w-3 h-3 text-white mx-auto" />
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notification Timing */}
              <div>
                <label className="flex items-center space-x-3 text-sm font-medium text-gray-700 mb-2">
                  <Clock className="w-4 h-4" />
                  <span>Notification Timing</span>
                </label>
                <div className="flex space-x-2">
                  {([
                    { value: 'morning', label: 'Morning', icon: Sun },
                    { value: 'evening', label: 'Evening', icon: Moon },
                    { value: 'both', label: 'Both', icon: Clock }
                  ] as const).map(({ value, label, icon: Icon }) => (
                    <button
                      key={value}
                      onClick={() => handlePreferenceChange('notificationTiming', value)}
                      className={`flex-1 py-2 px-3 rounded-xl border transition-all flex items-center justify-center space-x-2 ${
                        preferences.notificationTiming === value
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-sm">{label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100">
          <button
            onClick={onClose}
            className="w-full py-3 px-4 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal; 