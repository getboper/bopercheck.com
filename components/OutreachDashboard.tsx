import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Download, Eye, MousePointer, Mail, CheckCircle, XCircle, Clock, Users } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

interface OutreachRecord {
  id: string;
  businessName: string;
  businessEmail: string;
  location: string;
  outreachType: string;
  dateContacted: string;
  responded: boolean;
  converted: boolean;
  emailStatus: string;
  deliveryStatus?: string;
  deliveredAt?: string;
  openedAt?: string;
  clickedAt?: string;
  clickCount?: number;
  visitedSite?: boolean;
  lastClickedAt?: string;
  userAgent?: string;
  ipAddress?: string;
  notes?: string;
  updatedAt?: string;
}

interface OutreachStats {
  totalContacted: number;
  deliveredCount: number;
  openedCount: number;
  clickedCount: number;
  responseCount: number;
  conversionCount: number;
  failedCount: number;
  totalClicks: number;
  siteVisits: number;
  deliveryRate: string;
  openRate: string;
  clickRate: string;
  responseRate: string;
}

export default function OutreachDashboard() {
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [recordsPerPage, setRecordsPerPage] = useState(50);

  const { data: outreachData, isLoading, refetch } = useQuery({
    queryKey: ['/api/admin/outreach-records', currentPage, filter, search, recordsPerPage],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        filter,
        search,
        limit: recordsPerPage.toString()
      });
      
      const response = await apiRequest('GET', `/api/admin/outreach-records?${params}`);
      return response.json();
    },
    refetchInterval: 30000, // Refresh every 30 seconds for real-time updates
  });

  const handleExport = async (format: 'csv' | 'json') => {
    try {
      const params = new URLSearchParams({
        format,
        filter,
        search
      });
      
      const response = await apiRequest('GET', `/api/admin/outreach-export?${params}`);
      
      if (format === 'json') {
        const data = await response.json();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `outreach-export-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
      } else {
        const csvData = await response.text();
        const blob = new Blob([csvData], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `outreach-export-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  const getStatusBadge = (record: OutreachRecord) => {
    if (record.converted) {
      return <span style={{ backgroundColor: '#10b981', color: 'white', padding: '0.25rem 0.5rem', borderRadius: '0.375rem', fontSize: '0.75rem', fontWeight: '600' }}>Converted</span>;
    }
    if (record.responded) {
      return <span style={{ backgroundColor: '#3b82f6', color: 'white', padding: '0.25rem 0.5rem', borderRadius: '0.375rem', fontSize: '0.75rem', fontWeight: '600' }}>Responded</span>;
    }
    if (record.clickedAt) {
      return <span style={{ backgroundColor: '#8b5cf6', color: 'white', padding: '0.25rem 0.5rem', borderRadius: '0.375rem', fontSize: '0.75rem', fontWeight: '600' }}>Clicked</span>;
    }
    if (record.openedAt) {
      return <span style={{ backgroundColor: '#f59e0b', color: 'black', padding: '0.25rem 0.5rem', borderRadius: '0.375rem', fontSize: '0.75rem', fontWeight: '600' }}>Opened</span>;
    }
    if (record.deliveryStatus === 'delivered') {
      return <span style={{ backgroundColor: '#6b7280', color: 'white', padding: '0.25rem 0.5rem', borderRadius: '0.375rem', fontSize: '0.75rem', fontWeight: '600' }}>Delivered</span>;
    }
    if (record.emailStatus === 'bounced' || record.emailStatus === 'failed') {
      return <span style={{ backgroundColor: '#ef4444', color: 'white', padding: '0.25rem 0.5rem', borderRadius: '0.375rem', fontSize: '0.75rem', fontWeight: '600' }}>Failed</span>;
    }
    return <span style={{ backgroundColor: '#9ca3af', color: 'white', padding: '0.25rem 0.5rem', borderRadius: '0.375rem', fontSize: '0.75rem', fontWeight: '600' }}>Sent</span>;
  };

  const stats: OutreachStats = outreachData?.stats || {
    totalContacted: 0,
    deliveredCount: 0,
    openedCount: 0,
    clickedCount: 0,
    responseCount: 0,
    conversionCount: 0,
    failedCount: 0,
    totalClicks: 0,
    siteVisits: 0,
    deliveryRate: '0.0',
    openRate: '0.0',
    clickRate: '0.0',
    responseRate: '0.0'
  };

  const records: OutreachRecord[] = outreachData?.records || [];
  const pagination = outreachData?.pagination || {
    currentPage: 1,
    totalPages: 1,
    totalRecords: 0,
    hasNextPage: false,
    hasPreviousPage: false,
    recordsPerPage: 50
  };

  if (isLoading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <div style={{ display: 'inline-block', width: '2rem', height: '2rem', border: '4px solid #3b82f6', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        <p style={{ marginTop: '1rem' }}>Loading outreach transparency data...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '0', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      {/* Header with Export */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: '700', color: '#1e3a8a', margin: 0 }}>
          Outreach Transparency Dashboard
        </h2>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button 
            onClick={() => handleExport('csv')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 1rem',
              backgroundColor: '#f3f4f6',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem',
              cursor: 'pointer',
              fontSize: '0.875rem'
            }}
          >
            <Download style={{ width: '1rem', height: '1rem' }} />
            Export CSV
          </button>
          <button 
            onClick={() => handleExport('json')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 1rem',
              backgroundColor: '#f3f4f6',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem',
              cursor: 'pointer',
              fontSize: '0.875rem'
            }}
          >
            <Download style={{ width: '1rem', height: '1rem' }} />
            Export JSON
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <h3 style={{ fontSize: '0.875rem', fontWeight: '500', color: '#6b7280', margin: 0 }}>Total Contacted</h3>
            <Users style={{ width: '1rem', height: '1rem', color: '#6b7280' }} />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '700', color: '#1f2937' }}>{stats.totalContacted}</div>
          <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: 0 }}>
            {stats.deliveryRate}% delivery rate
          </p>
        </div>

        <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <h3 style={{ fontSize: '0.875rem', fontWeight: '500', color: '#6b7280', margin: 0 }}>Email Opens</h3>
            <Eye style={{ width: '1rem', height: '1rem', color: '#6b7280' }} />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '700', color: '#1f2937' }}>{stats.openedCount}</div>
          <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: 0 }}>
            {stats.openRate}% open rate
          </p>
        </div>

        <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <h3 style={{ fontSize: '0.875rem', fontWeight: '500', color: '#6b7280', margin: 0 }}>Link Clicks</h3>
            <MousePointer style={{ width: '1rem', height: '1rem', color: '#6b7280' }} />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '700', color: '#1f2937' }}>{stats.clickedCount}</div>
          <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: 0 }}>
            {stats.clickRate}% click rate ({stats.totalClicks} total)
          </p>
        </div>

        <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <h3 style={{ fontSize: '0.875rem', fontWeight: '500', color: '#6b7280', margin: 0 }}>Responses</h3>
            <CheckCircle style={{ width: '1rem', height: '1rem', color: '#6b7280' }} />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '700', color: '#1f2937' }}>{stats.responseCount}</div>
          <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: 0 }}>
            {stats.responseRate}% response rate
          </p>
        </div>
      </div>

      {/* Filters and Search */}
      <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem', color: '#1f2937' }}>Filter and Search Outreach Records</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
          <input
            type="text"
            placeholder="Search by business name, email, or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              flex: '1',
              minWidth: '250px',
              padding: '0.5rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem',
              fontSize: '0.875rem'
            }}
          />
          
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            style={{
              padding: '0.5rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem',
              fontSize: '0.875rem',
              minWidth: '150px'
            }}
          >
            <option value="all">All Records</option>
            <option value="recent">Recent (7 days)</option>
            <option value="delivered">Delivered</option>
            <option value="opened">Opened</option>
            <option value="clicked">Clicked</option>
            <option value="responded">Responded</option>
            <option value="converted">Converted</option>
            <option value="failed">Failed/Bounced</option>
          </select>

          <select 
            value={recordsPerPage.toString()} 
            onChange={(e) => setRecordsPerPage(parseInt(e.target.value))}
            style={{
              padding: '0.5rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem',
              fontSize: '0.875rem'
            }}
          >
            <option value="25">25 per page</option>
            <option value="50">50 per page</option>
            <option value="100">100 per page</option>
          </select>

          <button 
            onClick={() => refetch()}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '0.375rem',
              cursor: 'pointer',
              fontSize: '0.875rem'
            }}
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Records Table */}
      <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid #e5e7eb' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '600', margin: 0, color: '#1f2937' }}>
            Outreach Records ({pagination.totalRecords} total, showing page {pagination.currentPage} of {pagination.totalPages})
          </h3>
        </div>
        <div style={{ padding: '1.5rem' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                  <th style={{ textAlign: 'left', padding: '0.75rem', fontWeight: '600', color: '#374151' }}>Business</th>
                  <th style={{ textAlign: 'left', padding: '0.75rem', fontWeight: '600', color: '#374151' }}>Email</th>
                  <th style={{ textAlign: 'left', padding: '0.75rem', fontWeight: '600', color: '#374151' }}>Location</th>
                  <th style={{ textAlign: 'left', padding: '0.75rem', fontWeight: '600', color: '#374151' }}>Date Contacted</th>
                  <th style={{ textAlign: 'left', padding: '0.75rem', fontWeight: '600', color: '#374151' }}>Status</th>
                  <th style={{ textAlign: 'left', padding: '0.75rem', fontWeight: '600', color: '#374151' }}>Tracking</th>
                </tr>
              </thead>
              <tbody>
                {records.map((record) => (
                  <tr key={record.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <td style={{ padding: '0.75rem', fontWeight: '500', color: '#1f2937' }}>{record.businessName}</td>
                    <td style={{ padding: '0.75rem', fontSize: '0.875rem', color: '#6b7280' }}>{record.businessEmail}</td>
                    <td style={{ padding: '0.75rem', fontSize: '0.875rem', color: '#374151' }}>{record.location || 'N/A'}</td>
                    <td style={{ padding: '0.75rem', fontSize: '0.875rem', color: '#374151' }}>
                      {new Date(record.dateContacted).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '0.75rem' }}>
                      {getStatusBadge(record)}
                    </td>
                    <td style={{ padding: '0.75rem', fontSize: '0.875rem' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        {record.deliveredAt && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#10b981' }}>
                            <Mail style={{ width: '0.75rem', height: '0.75rem' }} />
                            Delivered {new Date(record.deliveredAt).toLocaleDateString()}
                          </div>
                        )}
                        {record.openedAt && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#3b82f6' }}>
                            <Eye style={{ width: '0.75rem', height: '0.75rem' }} />
                            Opened {new Date(record.openedAt).toLocaleDateString()}
                          </div>
                        )}
                        {record.clickedAt && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#8b5cf6' }}>
                            <MousePointer style={{ width: '0.75rem', height: '0.75rem' }} />
                            Clicked {record.clickCount || 1} time(s)
                          </div>
                        )}
                        {record.visitedSite && (
                          <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                            Visited site from {record.ipAddress || 'unknown IP'}
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem' }}>
            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
              Showing {records.length} of {pagination.totalRecords} records
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={!pagination.hasPreviousPage}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: pagination.hasPreviousPage ? '#f3f4f6' : '#e5e7eb',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  cursor: pagination.hasPreviousPage ? 'pointer' : 'not-allowed',
                  fontSize: '0.875rem'
                }}
              >
                Previous
              </button>
              <span style={{ display: 'flex', alignItems: 'center', padding: '0 0.75rem', fontSize: '0.875rem' }}>
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={!pagination.hasNextPage}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: pagination.hasNextPage ? '#f3f4f6' : '#e5e7eb',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  cursor: pagination.hasNextPage ? 'pointer' : 'not-allowed',
                  fontSize: '0.875rem'
                }}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Status Indicator */}
      <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.75rem', color: '#6b7280' }}>
        Last updated: {new Date().toLocaleTimeString()} • Auto-refreshing every 30 seconds
      </div>
    </div>
  );
}