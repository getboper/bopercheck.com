import { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, XCircle, Clock, RefreshCw, Mail } from 'lucide-react';

interface BusinessNotification {
  id: string;
  businessEmail: string;
  notificationType: string;
  status: string;
  errorMessage: string | null;
  createdAt: string;
  retryCount: number;
}

interface NotificationStats {
  totalNotifications: number;
  successfulNotifications: number;
  failedNotifications: number;
  notifications: BusinessNotification[];
}

interface QuickAdminAccessProps {
  onNavigate?: (page: string) => void;
}

export default function QuickAdminAccess({ onNavigate }: QuickAdminAccessProps) {
  const [stats, setStats] = useState<NotificationStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [selectedNotification, setSelectedNotification] = useState<BusinessNotification | null>(null);

  const fetchNotificationStats = async () => {
    try {
      const response = await fetch('/api/admin/business-notifications?days=7', {
        headers: {
          'Authorization': 'Bearer admin-token',
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data.data);
      } else {
        setMessage('Failed to fetch notification data');
      }
    } catch (error) {
      setMessage('Error connecting to notification system');
    } finally {
      setLoading(false);
    }
  };

  const testNotification = async () => {
    try {
      const response = await fetch('/api/admin/test-business-notification', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer admin-token',
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setMessage('Test notification sent successfully');
        fetchNotificationStats();
      } else {
        setMessage('Failed to send test notification');
      }
    } catch (error) {
      setMessage('Error sending test notification');
    }
  };

  const retryNotification = async (notificationId: string) => {
    try {
      const response = await fetch(`/api/admin/business-notifications/${notificationId}/retry`, {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer admin-token',
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setMessage('Notification retry sent successfully');
        fetchNotificationStats();
      } else {
        setMessage('Failed to retry notification');
      }
    } catch (error) {
      setMessage('Error retrying notification');
    }
  };

  useEffect(() => {
    fetchNotificationStats();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      sent: 'bg-green-100 text-green-800 border-green-200',
      failed: 'bg-red-100 text-red-800 border-red-200',
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    } as const;
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200'}`}>
        {status}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center">
          <RefreshCw className="h-6 w-6 animate-spin mr-2" />
          <span>Loading business notification system...</span>
        </div>
      </div>
    );
  }

  const totalNotifications = stats?.totalNotifications || 0;
  const successfulNotifications = stats?.successfulNotifications || 0;
  const failedNotifications = stats?.failedNotifications || 0;
  const successRate = totalNotifications > 0 ? Math.round((successfulNotifications / totalNotifications) * 100) : 0;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Business Notification System</h1>
          <p className="text-gray-600">Production-ready notification monitoring with full accountability</p>
        </div>
        <div className="flex gap-2">
          <button
            className="flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            onClick={fetchNotificationStats}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </button>
          <button
            className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
            onClick={() => onNavigate && onNavigate('admin-business-override')}
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Add My Business
          </button>
          <button
            className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            onClick={testNotification}
          >
            <Mail className="h-4 w-4 mr-2" />
            Test Notification
          </button>
        </div>
      </div>

      {message && (
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
          <p className="text-blue-800">{message}</p>
        </div>
      )}

      {/* Notification Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Mail className="h-8 w-8 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Notifications</dt>
                  <dd className="text-lg font-medium text-gray-900">{totalNotifications}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircle className="h-8 w-8 text-green-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Successful</dt>
                  <dd className="text-lg font-medium text-gray-900">{successfulNotifications}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <XCircle className="h-8 w-8 text-red-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Failed</dt>
                  <dd className="text-lg font-medium text-gray-900">{failedNotifications}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <AlertCircle className="h-8 w-8 text-blue-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Success Rate</dt>
                  <dd className="text-lg font-medium text-gray-900">{successRate}%</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Notifications */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Recent Notifications</h3>
          
          {!stats || stats.notifications.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No notifications found. Send a test notification to get started.
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {stats.notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => setSelectedNotification(notification)}
                >
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(notification.status)}
                    <div>
                      <div className="font-medium">{notification.businessEmail}</div>
                      <div className="text-sm text-gray-500">
                        {notification.notificationType}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {notification.status === 'failed' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          retryNotification(notification.id);
                        }}
                        className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
                      >
                        Retry
                      </button>
                    )}
                    {getStatusBadge(notification.status)}
                    <div className="text-xs text-gray-500">
                      {formatDate(notification.createdAt)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Notification Details */}
      {selectedNotification && (
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Notification Details</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-500">Business Email</label>
                <p className="text-sm text-gray-900">{selectedNotification.businessEmail}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Status</label>
                <div className="flex items-center space-x-2 mt-1">
                  {getStatusIcon(selectedNotification.status)}
                  {getStatusBadge(selectedNotification.status)}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Created At</label>
                <p className="text-sm text-gray-900">{formatDate(selectedNotification.createdAt)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Retry Count</label>
                <p className="text-sm text-gray-900">{selectedNotification.retryCount || 0}</p>
              </div>
              {selectedNotification.errorMessage && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Error Message</label>
                  <p className="text-sm text-red-600">{selectedNotification.errorMessage}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}