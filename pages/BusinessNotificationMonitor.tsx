import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { RefreshCw, Mail, CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

interface BusinessNotification {
  id: string;
  businessEmail: string;
  notificationType: string;
  status: string;
  response: string | null;
  createdAt: string;
}

export default function BusinessNotificationMonitor() {
  const queryClient = useQueryClient();
  const [selectedNotification, setSelectedNotification] = useState<BusinessNotification | null>(null);
  const [message, setMessage] = useState<string>('');

  // Fetch all notifications
  const { data: notifications = [], isLoading, error } = useQuery({
    queryKey: ['/api/admin/notifications'],
    retry: false,
  });

  // Test notification mutation
  const testNotificationMutation = useMutation({
    mutationFn: () => apiRequest('POST', '/api/admin/notifications/test'),
    onSuccess: () => {
      setMessage('Test notification created successfully');
      queryClient.invalidateQueries({ queryKey: ['/api/admin/notifications'] });
    },
    onError: (error) => {
      setMessage('Failed to create test notification');
    },
  });

  // Calculate stats
  const totalNotifications = notifications.length;
  const successfulNotifications = notifications.filter((n: BusinessNotification) => n.status === 'sent').length;
  const failedNotifications = notifications.filter((n: BusinessNotification) => n.status === 'failed').length;
  const successRate = totalNotifications > 0 ? Math.round((successfulNotifications / totalNotifications) * 100) : 0;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-500" />;
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

  const retryNotification = useMutation({
    mutationFn: async (notificationId: string) => {
      const response = await fetch(`/api/admin/business-notifications/${notificationId}/retry`, {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer admin-token',
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        throw new Error('Failed to retry notification');
      }
      return response.json();
    },
    onSuccess: () => {
      setMessage('Notification retry sent successfully');
      queryClient.invalidateQueries({ queryKey: ['/api/admin/notifications'] });
    },
    onError: () => {
      setMessage('Failed to retry notification');
    }
  });

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="bg-white shadow rounded-lg">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-red-600 mb-2">Access Denied</h2>
            <p className="text-gray-600">
              You need admin privileges to access the Business Notification Monitor.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Business Notification Monitor</h1>
          <p className="text-gray-600">
            Complete visibility and accountability for all business email notifications
          </p>
        </div>
        <div className="flex gap-2">
          <button
            className="flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            onClick={() => queryClient.invalidateQueries({ queryKey: ['/api/admin/notifications'] })}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
            onClick={() => testNotificationMutation.mutate()}
            disabled={testNotificationMutation.isPending}
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

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Mail className="h-6 w-6 text-gray-400" />
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
                <CheckCircle className="h-6 w-6 text-green-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Successful</dt>
                  <dd className="text-lg font-medium text-green-600">{successfulNotifications}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <XCircle className="h-6 w-6 text-red-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Failed</dt>
                  <dd className="text-lg font-medium text-red-600">{failedNotifications}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-6 w-6 text-gray-400" />
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

      {/* Notifications List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-2">Recent Notifications</h3>
            <p className="text-sm text-gray-500 mb-4">Latest business notification delivery logs</p>
            
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <RefreshCw className="h-6 w-6 animate-spin" />
                <span className="ml-2">Loading notifications...</span>
              </div>
            ) : notifications.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No notifications found
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {notifications.map((notification: BusinessNotification) => (
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
                            retryNotification.mutate(notification.id);
                          }}
                          className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
                          disabled={retryNotification.isPending}
                        >
                          {retryNotification.isPending ? 'Retrying...' : 'Retry'}
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
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-2">Notification Details</h3>
            <p className="text-sm text-gray-500 mb-4">Detailed information about selected notification</p>
            
            {selectedNotification ? (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-900">Business Email</label>
                  <div className="text-sm text-gray-600 mt-1">
                    {selectedNotification.businessEmail}
                  </div>
                </div>
                
                <hr className="border-gray-200" />
                
                <div>
                  <label className="text-sm font-medium text-gray-900">Notification Type</label>
                  <div className="text-sm text-gray-600 mt-1">
                    {selectedNotification.notificationType}
                  </div>
                </div>
                
                <hr className="border-gray-200" />
                
                <div>
                  <label className="text-sm font-medium text-gray-900">Status</label>
                  <div className="flex items-center space-x-2 mt-1">
                    {getStatusIcon(selectedNotification.status)}
                    {getStatusBadge(selectedNotification.status)}
                  </div>
                </div>
                
                <hr className="border-gray-200" />
                
                <div>
                  <label className="text-sm font-medium text-gray-900">Timestamp</label>
                  <div className="text-sm text-gray-600 mt-1">
                    {formatDate(selectedNotification.createdAt)}
                  </div>
                </div>
                
                {selectedNotification.response && (
                  <>
                    <hr className="border-gray-200" />
                    <div>
                      <label className="text-sm font-medium text-gray-900">Response</label>
                      <div className="text-sm text-gray-600 mt-1 p-3 bg-gray-50 rounded-md">
                        {selectedNotification.response}
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                Select a notification to view details
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}