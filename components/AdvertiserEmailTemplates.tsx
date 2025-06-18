import { useState } from 'react';
import { Mail, Send, Eye, TrendingUp, Users } from 'lucide-react';

interface EmailTemplate {
  id: string;
  subject: string;
  type: 'search_alert' | 'weekly_report' | 'opportunity';
  content: string;
  variables: string[];
}

export default function AdvertiserEmailTemplates() {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('search_alert');
  const [previewData, setPreviewData] = useState({
    businessName: 'Sparkle Window Cleaning',
    searchTerm: 'window cleaning',
    location: 'Plymouth',
    searchVolume: 22,
    competitors: 3
  });

  const templates: EmailTemplate[] = [
    {
      id: 'search_alert',
      subject: 'Someone Just Searched for Your Services',
      type: 'search_alert',
      content: `
        <h1>👀 Someone Just Searched for Your Services</h1>
        <p>Hello there!</p>
        <p>Our system spotted a recent search for <strong>"{{searchTerm}}"</strong> in <strong>{{location}}</strong>.</p>
        <div class="info-box">
          <p><strong>Search Volume:</strong> {{searchVolume}} people searched this week</p>
          <p><strong>Competitor Mentions:</strong> {{competitors}} local businesses appeared in the top results</p>
        </div>
        <p>Would you like your business to appear next time?</p>
        <a href="https://bopercheck.com/advertise" class="cta-button">Feature My Business</a>
      `,
      variables: ['searchTerm', 'location', 'searchVolume', 'competitors']
    },
    {
      id: 'weekly_report',
      subject: 'Your Weekly BoperCheck Business Report',
      type: 'weekly_report',
      content: `
        <h1>📊 Your Weekly BoperCheck Report</h1>
        <p><strong>Business:</strong> {{businessName}}</p>
        <p><strong>Location:</strong> {{location}}</p>
        <div class="report-box">
          <p>👀 <strong>Searches for your service:</strong> {{searchVolume}}</p>
          <p>📍 <strong>Local exposure rate:</strong> 78%</p>
          <p>🏆 <strong>Top keyword opportunity:</strong> "gutter and fascia cleaning"</p>
          <p>📈 <strong>Suggested Boost:</strong> +22% click-through with ad upgrade</p>
        </div>
        <p>🎯 Want to appear first next week?</p>
        <a href="https://bopercheck.com/feature" class="cta-button">Feature My Business</a>
      `,
      variables: ['businessName', 'location', 'searchVolume']
    },
    {
      id: 'opportunity',
      subject: 'New Business Opportunity Detected',
      type: 'opportunity',
      content: `
        <h1>🎯 New Opportunity Alert</h1>
        <p>Hi {{businessName}},</p>
        <p>We've detected increased search activity for your services in {{location}}.</p>
        <div class="opportunity-box">
          <p><strong>Trending Search:</strong> "{{searchTerm}}"</p>
          <p><strong>Search Increase:</strong> +45% this week</p>
          <p><strong>Competition Level:</strong> Low</p>
        </div>
        <p>This is a perfect time to boost your visibility!</p>
        <a href="https://bopercheck.com/upgrade" class="cta-button">Capture This Opportunity</a>
      `,
      variables: ['businessName', 'location', 'searchTerm']
    }
  ];

  const renderPreview = (template: EmailTemplate) => {
    let content = template.content;
    
    // Replace variables with preview data
    content = content.replace(/{{businessName}}/g, previewData.businessName);
    content = content.replace(/{{searchTerm}}/g, previewData.searchTerm);
    content = content.replace(/{{location}}/g, previewData.location);
    content = content.replace(/{{searchVolume}}/g, previewData.searchVolume.toString());
    content = content.replace(/{{competitors}}/g, previewData.competitors.toString());

    return content;
  };

  const selectedTemplateData = templates.find(t => t.id === selectedTemplate);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f0f4ff 0%, #e2e8f0 100%)',
      padding: '2rem',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '900', color: '#1e3a8a', margin: '0 0 1rem 0' }}>
            Advertiser Email Templates
          </h1>
          <p style={{ fontSize: '1.2rem', color: '#6b7280', margin: 0 }}>
            Automated business notification system with intelligent targeting
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
          {/* Template Selector */}
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '2rem',
            boxShadow: '0 8px 24px rgba(0,0,0,0.08)'
          }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: '700', color: '#1e3a8a', marginBottom: '1.5rem' }}>
              Email Templates
            </h3>
            
            {templates.map((template) => (
              <button
                key={template.id}
                onClick={() => setSelectedTemplate(template.id)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '1rem',
                  border: selectedTemplate === template.id ? '2px solid #4f46e5' : '2px solid #e5e7eb',
                  borderRadius: '12px',
                  background: selectedTemplate === template.id ? '#f0f4ff' : 'white',
                  cursor: 'pointer',
                  marginBottom: '1rem',
                  textAlign: 'left'
                }}
              >
                <Mail style={{ width: '1.5rem', height: '1.5rem', color: '#4f46e5' }} />
                <div>
                  <div style={{ fontWeight: '600', color: '#1e3a8a' }}>
                    {template.subject}
                  </div>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280', textTransform: 'capitalize' }}>
                    {template.type.replace('_', ' ')}
                  </div>
                </div>
              </button>
            ))}

            {/* Preview Data Controls */}
            <div style={{ marginTop: '2rem', padding: '1.5rem', background: '#f8fafc', borderRadius: '12px' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: '600', color: '#1e3a8a', marginBottom: '1rem' }}>
                Preview Data
              </h4>
              <div style={{ display: 'grid', gap: '0.5rem' }}>
                <input
                  type="text"
                  placeholder="Business Name"
                  value={previewData.businessName}
                  onChange={(e) => setPreviewData({...previewData, businessName: e.target.value})}
                  style={{
                    padding: '0.5rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '0.875rem'
                  }}
                />
                <input
                  type="text"
                  placeholder="Search Term"
                  value={previewData.searchTerm}
                  onChange={(e) => setPreviewData({...previewData, searchTerm: e.target.value})}
                  style={{
                    padding: '0.5rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '0.875rem'
                  }}
                />
                <input
                  type="text"
                  placeholder="Location"
                  value={previewData.location}
                  onChange={(e) => setPreviewData({...previewData, location: e.target.value})}
                  style={{
                    padding: '0.5rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '0.875rem'
                  }}
                />
              </div>
            </div>
          </div>

          {/* Email Preview */}
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '2rem',
            boxShadow: '0 8px 24px rgba(0,0,0,0.08)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: '700', color: '#1e3a8a', margin: 0 }}>
                Email Preview
              </h3>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 1rem',
                  background: '#4f46e5',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  cursor: 'pointer'
                }}>
                  <Send size={16} />
                  Send Test
                </button>
                <button style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 1rem',
                  background: '#059669',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  cursor: 'pointer'
                }}>
                  <Eye size={16} />
                  Preview
                </button>
              </div>
            </div>

            {selectedTemplateData && (
              <div style={{
                border: '2px solid #e5e7eb',
                borderRadius: '12px',
                padding: '2rem',
                background: '#f5f9ff',
                minHeight: '400px'
              }}>
                <div
                  style={{
                    fontFamily: '"Segoe UI", sans-serif',
                    lineHeight: '1.6',
                    color: '#333'
                  }}
                  dangerouslySetInnerHTML={{
                    __html: `
                      <style>
                        .info-box, .report-box, .opportunity-box {
                          background-color: #eff6ff;
                          border-left: 4px solid #3b82f6;
                          padding: 1rem;
                          margin: 1.5rem 0;
                          border-radius: 8px;
                        }
                        .cta-button {
                          background-color: #3b82f6;
                          color: white;
                          padding: 0.75rem 1.5rem;
                          border: none;
                          border-radius: 8px;
                          font-size: 1rem;
                          text-decoration: none;
                          display: inline-block;
                          margin-top: 1.5rem;
                        }
                      </style>
                      ${renderPreview(selectedTemplateData)}
                    `
                  }}
                />
              </div>
            )}

            {/* Template Statistics */}
            <div style={{
              marginTop: '2rem',
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '1rem'
            }}>
              <div style={{ textAlign: 'center', padding: '1rem', background: '#f8fafc', borderRadius: '8px' }}>
                <TrendingUp style={{ width: '1.5rem', height: '1.5rem', color: '#059669', margin: '0 auto 0.5rem' }} />
                <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#059669' }}>23.4%</div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Open Rate</div>
              </div>
              <div style={{ textAlign: 'center', padding: '1rem', background: '#f8fafc', borderRadius: '8px' }}>
                <Users style={{ width: '1.5rem', height: '1.5rem', color: '#4f46e5', margin: '0 auto 0.5rem' }} />
                <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#4f46e5' }}>847</div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Sent Today</div>
              </div>
              <div style={{ textAlign: 'center', padding: '1rem', background: '#f8fafc', borderRadius: '8px' }}>
                <Send style={{ width: '1.5rem', height: '1.5rem', color: '#d97706', margin: '0 auto 0.5rem' }} />
                <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#d97706' }}>5.8%</div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Click Rate</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}