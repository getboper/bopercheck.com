import React, { useState, useEffect } from 'react';
import { Settings, Shield, Mail, Clock } from 'lucide-react';

interface OutreachConfig {
  dailyBatchSize: number;
  maxDailyEmails: number;
  enableSafetyThrottling: boolean;
  cooldownDays: number;
  categoriesPerDay: number;
  locationsPerDay: number;
  delayBetweenEmails: number;
  enableUnsubscribeTracking: boolean;
  enableBounceTracking: boolean;
}

export function OutreachConfigPanel() {
  const [config, setConfig] = useState<OutreachConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const response = await fetch('/api/admin/outreach-config');
      if (response.ok) {
        const data = await response.json();
        setConfig(data);
      }
    } catch (error) {
      console.error('Error fetching config:', error);
      setSaveMessage('Failed to load configuration');
    } finally {
      setIsLoading(false);
    }
  };

  const saveConfig = async () => {
    if (!config) return;
    
    setIsSaving(true);
    setSaveMessage('');
    try {
      const response = await fetch('/api/admin/outreach-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });

      if (response.ok) {
        setSaveMessage('Configuration saved successfully!');
        setTimeout(() => setSaveMessage(''), 3000);
      } else {
        const error = await response.json();
        setSaveMessage(`Error: ${error.error || 'Failed to save configuration'}`);
      }
    } catch (error) {
      console.error('Error saving config:', error);
      setSaveMessage('Error: Failed to save configuration');
    } finally {
      setIsSaving(false);
    }
  };

  const setPresetMode = (mode: 'conservative' | 'moderate' | 'aggressive') => {
    if (!config) return;

    const presets = {
      conservative: {
        dailyBatchSize: 25,
        categoriesPerDay: 5,
        locationsPerDay: 8,
        delayBetweenEmails: 3000
      },
      moderate: {
        dailyBatchSize: 75,
        categoriesPerDay: 8,
        locationsPerDay: 12,
        delayBetweenEmails: 2000
      },
      aggressive: {
        dailyBatchSize: 150,
        categoriesPerDay: 12,
        locationsPerDay: 16,
        delayBetweenEmails: 1000
      }
    };

    setConfig({ ...config, ...presets[mode] });
  };

  const cardStyle = {
    backgroundColor: 'white',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    padding: '24px',
    marginBottom: '16px'
  };

  const inputStyle = {
    width: '100%',
    padding: '12px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '14px'
  };

  const buttonStyle = {
    backgroundColor: '#4f46e5',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    padding: '12px 24px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    marginRight: '8px'
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '8px',
    fontSize: '14px',
    fontWeight: '500',
    color: '#374151'
  };

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <div style={{
          display: 'inline-block',
          width: '24px',
          height: '24px',
          border: '3px solid #f3f3f3',
          borderTop: '3px solid #4f46e5',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <p style={{ marginTop: '16px', color: '#6b7280' }}>Loading configuration...</p>
      </div>
    );
  }

  if (!config) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <p style={{ color: '#dc2626', marginBottom: '16px' }}>Error loading configuration</p>
        <button onClick={fetchConfig} style={buttonStyle}>Retry</button>
      </div>
    );
  }

  return (
    <div style={{ padding: '0' }}>
      {/* Quick Presets */}
      <div style={cardStyle}>
        <label style={labelStyle}>Quick Presets</label>
        <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
          <button 
            onClick={() => setPresetMode('conservative')}
            style={{...buttonStyle, backgroundColor: '#10b981'}}
          >
            Conservative (25/day)
          </button>
          <button 
            onClick={() => setPresetMode('moderate')}
            style={{...buttonStyle, backgroundColor: '#f59e0b'}}
          >
            Moderate (75/day)
          </button>
          <button 
            onClick={() => setPresetMode('aggressive')}
            style={{...buttonStyle, backgroundColor: '#ef4444'}}
          >
            Aggressive (150/day)
          </button>
        </div>
      </div>

      {/* Batch Configuration */}
      <div style={cardStyle}>
        <label style={labelStyle}>
          <Mail style={{ display: 'inline', marginRight: '8px', verticalAlign: 'middle' }} size={16} />
          Email Volume Settings
        </label>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '16px' }}>
          <div>
            <label style={labelStyle}>Daily Target Emails</label>
            <input
              type="number"
              value={config.dailyBatchSize}
              onChange={(e) => setConfig({ ...config, dailyBatchSize: parseInt(e.target.value) || 0 })}
              style={inputStyle}
              min="1"
              max="250"
            />
          </div>
          
          <div>
            <label style={labelStyle}>Safety Limit (Max)</label>
            <input
              type="number"
              value={config.maxDailyEmails}
              onChange={(e) => setConfig({ ...config, maxDailyEmails: parseInt(e.target.value) || 0 })}
              style={inputStyle}
              min="1"
              max="500"
            />
          </div>

          <div>
            <label style={labelStyle}>Business Categories/Day</label>
            <input
              type="number"
              value={config.categoriesPerDay}
              onChange={(e) => setConfig({ ...config, categoriesPerDay: parseInt(e.target.value) || 0 })}
              style={inputStyle}
              min="1"
              max="20"
            />
          </div>

          <div>
            <label style={labelStyle}>Locations/Day</label>
            <input
              type="number"
              value={config.locationsPerDay}
              onChange={(e) => setConfig({ ...config, locationsPerDay: parseInt(e.target.value) || 0 })}
              style={inputStyle}
              min="1"
              max="30"
            />
          </div>

          <div>
            <label style={labelStyle}>
              <Clock style={{ display: 'inline', marginRight: '8px', verticalAlign: 'middle' }} size={16} />
              Email Delay (ms)
            </label>
            <input
              type="number"
              value={config.delayBetweenEmails}
              onChange={(e) => setConfig({ ...config, delayBetweenEmails: parseInt(e.target.value) || 0 })}
              style={inputStyle}
              min="500"
              max="10000"
            />
          </div>

          <div>
            <label style={labelStyle}>Cooldown Period (days)</label>
            <input
              type="number"
              value={config.cooldownDays}
              onChange={(e) => setConfig({ ...config, cooldownDays: parseInt(e.target.value) || 0 })}
              style={inputStyle}
              min="1"
              max="90"
            />
          </div>
        </div>
      </div>

      {/* GDPR Compliance */}
      <div style={cardStyle}>
        <label style={labelStyle}>
          <Shield style={{ display: 'inline', marginRight: '8px', verticalAlign: 'middle' }} size={16} />
          GDPR Compliance Settings
        </label>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <input
              type="checkbox"
              checked={config.enableUnsubscribeTracking}
              onChange={(e) => setConfig({ ...config, enableUnsubscribeTracking: e.target.checked })}
            />
            Enable Unsubscribe Tracking (Required for GDPR)
          </label>
          
          <label style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <input
              type="checkbox"
              checked={config.enableBounceTracking}
              onChange={(e) => setConfig({ ...config, enableBounceTracking: e.target.checked })}
            />
            Enable Bounce Tracking
          </label>
          
          <label style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <input
              type="checkbox"
              checked={config.enableSafetyThrottling}
              onChange={(e) => setConfig({ ...config, enableSafetyThrottling: e.target.checked })}
            />
            Enable Safety Throttling
          </label>
        </div>
      </div>

      {/* Current Status */}
      <div style={{...cardStyle, backgroundColor: '#f9fafb'}}>
        <h4 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600' }}>Current Configuration Summary</h4>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '14px' }}>
          <div>Daily Target: <strong>{config.dailyBatchSize} emails</strong></div>
          <div>Safety Limit: <strong>{config.maxDailyEmails} emails</strong></div>
          <div>Email Delay: <strong>{config.delayBetweenEmails}ms</strong></div>
          <div>Cooldown: <strong>{config.cooldownDays} days</strong></div>
        </div>
      </div>

      {/* Save Button */}
      <button 
        onClick={saveConfig} 
        disabled={isSaving}
        style={{
          ...buttonStyle,
          width: '100%',
          opacity: isSaving ? 0.7 : 1,
          cursor: isSaving ? 'not-allowed' : 'pointer'
        }}
      >
        {isSaving ? 'Saving Configuration...' : 'Save Configuration'}
      </button>

      {saveMessage && (
        <div style={{
          marginTop: '16px',
          padding: '12px',
          borderRadius: '6px',
          backgroundColor: saveMessage.includes('Error') ? '#fee2e2' : '#dcfce7',
          color: saveMessage.includes('Error') ? '#dc2626' : '#16a34a',
          fontSize: '14px'
        }}>
          {saveMessage}
        </div>
      )}
    </div>
  );
}