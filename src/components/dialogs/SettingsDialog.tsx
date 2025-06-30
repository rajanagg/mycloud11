import React, { useState } from 'react';
import { X, Settings, Palette, Type, Code, Monitor, User, Bell, Shield } from 'lucide-react';

interface SettingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (settings: any) => void;
  currentSettings?: any;
}

const SettingsDialog: React.FC<SettingsDialogProps> = ({
  isOpen,
  onClose,
  onSave,
  currentSettings = {}
}) => {
  const [activeTab, setActiveTab] = useState('appearance');
  const [settings, setSettings] = useState({
    theme: 'dark',
    fontSize: 14,
    fontFamily: 'Monaco',
    tabSize: 2,
    wordWrap: true,
    lineNumbers: true,
    minimap: true,
    autoSave: true,
    formatOnSave: false,
    notifications: true,
    ...currentSettings
  });

  const tabs = [
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'editor', label: 'Editor', icon: Code },
    { id: 'general', label: 'General', icon: Settings },
    { id: 'account', label: 'Account', icon: User },
    { id: 'privacy', label: 'Privacy', icon: Shield }
  ];

  const handleSave = () => {
    onSave(settings);
    onClose();
  };

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[80vh] overflow-hidden transform transition-all">
        <div className="bg-gradient-to-r from-gray-900 to-black p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-white bg-opacity-20 rounded-xl p-2">
                <Settings className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Settings</h2>
                <p className="text-gray-300 text-sm">Customize your Hunt experience</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-xl transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="flex h-full">
          {/* Sidebar */}
          <div className="w-64 bg-gray-50 border-r border-gray-200 p-4">
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                    activeTab === tab.id
                      ? 'bg-black text-white'
                      : 'text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <tab.icon className="h-5 w-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            {activeTab === 'appearance' && (
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-gray-900">Appearance Settings</h3>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Theme
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {['light', 'dark', 'auto'].map((theme) => (
                      <button
                        key={theme}
                        onClick={() => updateSetting('theme', theme)}
                        className={`p-4 border-2 rounded-xl transition-all ${
                          settings.theme === theme
                            ? 'border-black bg-gray-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="text-center">
                          <Monitor className="h-6 w-6 mx-auto mb-2" />
                          <span className="font-medium capitalize">{theme}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Font Size: {settings.fontSize}px
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="24"
                    value={settings.fontSize}
                    onChange={(e) => updateSetting('fontSize', parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Font Family
                  </label>
                  <select
                    value={settings.fontFamily}
                    onChange={(e) => updateSetting('fontFamily', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                  >
                    <option value="Monaco">Monaco</option>
                    <option value="Menlo">Menlo</option>
                    <option value="Consolas">Consolas</option>
                    <option value="Courier New">Courier New</option>
                  </select>
                </div>
              </div>
            )}

            {activeTab === 'editor' && (
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-gray-900">Editor Settings</h3>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Tab Size: {settings.tabSize}
                  </label>
                  <input
                    type="range"
                    min="2"
                    max="8"
                    value={settings.tabSize}
                    onChange={(e) => updateSetting('tabSize', parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div className="space-y-4">
                  {[
                    { key: 'wordWrap', label: 'Word Wrap', description: 'Wrap long lines' },
                    { key: 'lineNumbers', label: 'Line Numbers', description: 'Show line numbers' },
                    { key: 'minimap', label: 'Minimap', description: 'Show code minimap' },
                    { key: 'autoSave', label: 'Auto Save', description: 'Automatically save changes' },
                    { key: 'formatOnSave', label: 'Format on Save', description: 'Format code when saving' }
                  ].map((option) => (
                    <div key={option.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div>
                        <h4 className="font-semibold text-gray-900">{option.label}</h4>
                        <p className="text-sm text-gray-600">{option.description}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings[option.key]}
                          onChange={(e) => updateSetting(option.key, e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'general' && (
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-gray-900">General Settings</h3>
                
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <h4 className="font-semibold text-gray-900">Notifications</h4>
                    <p className="text-sm text-gray-600">Receive system notifications</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.notifications}
                      onChange={(e) => updateSetting('notifications', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            )}

            {activeTab === 'account' && (
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-gray-900">Account Settings</h3>
                <div className="bg-gray-50 rounded-xl p-6 text-center">
                  <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Account settings coming soon</p>
                </div>
              </div>
            )}

            {activeTab === 'privacy' && (
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-gray-900">Privacy Settings</h3>
                <div className="bg-gray-50 rounded-xl p-6 text-center">
                  <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Privacy settings coming soon</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <div className="flex justify-end space-x-4">
            <button
              onClick={onClose}
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-100 transition-colors font-semibold"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors font-semibold"
            >
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsDialog;