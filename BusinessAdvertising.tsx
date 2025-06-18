import { useState } from 'react';

interface BusinessAdvertisingProps {
  onClose: () => void;
}

const UK_LOCATIONS = [
  'London', 'Birmingham', 'Manchester', 'Liverpool', 'Leeds', 'Sheffield', 'Bristol', 
  'Newcastle', 'Nottingham', 'Leicester', 'Plymouth', 'Devon', 'Cornwall', 'Somerset'
];

const PACKAGE_TYPES = [
  {
    id: 'basic',
    name: 'Basic Package',
    price: '£49/month',
    maxLocations: 1,
    features: ['1 service location', 'Basic listing placement', 'Contact form leads']
  },
  {
    id: 'premium',
    name: 'Premium Package', 
    price: '£99/month',
    maxLocations: 5,
    features: ['Up to 5 service locations', 'Priority placement', 'Analytics dashboard']
  },
  {
    id: 'enterprise',
    name: 'Enterprise Package',
    price: '£199/month',
    maxLocations: 20,
    features: ['Up to 20 service locations', 'Top placement guarantee', 'Dedicated support']
  }
];

export default function BusinessAdvertising({ onClose }: BusinessAdvertisingProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    companyName: '',
    contactEmail: '',
    contactPhone: '',
    packageType: '',
    serviceLocations: [] as string[],
    primaryLocation: '',
    businessType: '',
    website: ''
  });

  const selectedPackage = PACKAGE_TYPES.find(pkg => pkg.id === formData.packageType);
  const maxLocations = selectedPackage?.maxLocations || 1;

  const handleLocationAdd = (location: string) => {
    if (formData.serviceLocations.length < maxLocations && !formData.serviceLocations.includes(location)) {
      setFormData(prev => ({
        ...prev,
        serviceLocations: [...prev.serviceLocations, location],
        primaryLocation: prev.primaryLocation || location
      }));
    }
  };

  const handleLocationRemove = (location: string) => {
    setFormData(prev => ({
      ...prev,
      serviceLocations: prev.serviceLocations.filter(loc => loc !== location),
      primaryLocation: prev.primaryLocation === location ? prev.serviceLocations[0] || '' : prev.primaryLocation
    }));
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch('/api/advertiser-signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          maxLocations,
          locationPackageLevel: formData.serviceLocations.length === 1 ? 'single' : 
                               formData.serviceLocations.length <= 5 ? 'regional' : 'national'
        })
      });

      if (response.ok) {
        alert('Application submitted successfully! We\'ll contact you within 24 hours.');
        onClose();
      } else {
        alert('Error submitting application. Please try again.');
      }
    } catch (error) {
      alert('Error submitting application. Please try again.');
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1rem'
    }}>
      <div style={{ 
        width: '100%', 
        maxWidth: '600px', 
        maxHeight: '90vh', 
        overflowY: 'auto',
        background: 'white',
        borderRadius: '12px',
        padding: '2rem'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', margin: 0 }}>Business Advertising Signup</h2>
          <button 
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer',
              padding: '0.5rem'
            }}
          >
            ×
          </button>
        </div>
        <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '2rem' }}>
          Step {step} of 3 - Get your business featured in BoperCheck search results
        </p>

        {step === 1 && (
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem' }}>
              Choose Your Package
            </h3>
            
            {PACKAGE_TYPES.map(pkg => (
              <div 
                key={pkg.id}
                style={{
                  border: formData.packageType === pkg.id ? '2px solid #3b82f6' : '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '1rem',
                  marginBottom: '1rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onClick={() => setFormData(prev => ({ ...prev, packageType: pkg.id }))}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: '600', margin: 0 }}>{pkg.name}</h4>
                  <span style={{ 
                    background: '#f3f4f6', 
                    padding: '0.25rem 0.5rem', 
                    borderRadius: '4px', 
                    fontSize: '0.9rem' 
                  }}>
                    {pkg.price}
                  </span>
                </div>
                <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                  Up to {pkg.maxLocations} service location{pkg.maxLocations > 1 ? 's' : ''}
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  {pkg.features.map((feature, idx) => (
                    <div key={idx} style={{ fontSize: '0.85rem', color: '#666' }}>
                      ✓ {feature}
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <button 
              onClick={() => setStep(2)} 
              disabled={!formData.packageType}
              style={{
                width: '100%',
                padding: '1rem',
                background: formData.packageType ? '#3b82f6' : '#9ca3af',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1rem',
                cursor: formData.packageType ? 'pointer' : 'not-allowed',
                marginTop: '1rem'
              }}
            >
              Continue to Business Details
            </button>
          </div>
        )}

        {step === 2 && (
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem' }}>
              Business Information
            </h3>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Company Name *</label>
              <input
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '1rem'
                }}
                value={formData.companyName}
                onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
                placeholder="Your Business Name"
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Contact Email *</label>
              <input
                type="email"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '1rem'
                }}
                value={formData.contactEmail}
                onChange={(e) => setFormData(prev => ({ ...prev, contactEmail: e.target.value }))}
                placeholder="your@business.com"
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Contact Phone</label>
              <input
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '1rem'
                }}
                value={formData.contactPhone}
                onChange={(e) => setFormData(prev => ({ ...prev, contactPhone: e.target.value }))}
                placeholder="01234 567890"
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Business Type *</label>
              <input
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '1rem'
                }}
                value={formData.businessType}
                onChange={(e) => setFormData(prev => ({ ...prev, businessType: e.target.value }))}
                placeholder="e.g. Window Cleaning, Plumbing, Electrical"
              />
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Website (Optional)</label>
              <input
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '1rem'
                }}
                value={formData.website}
                onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                placeholder="https://yourbusiness.co.uk"
              />
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button 
                onClick={() => setStep(1)}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: 'white',
                  color: '#374151',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                Back
              </button>
              <button 
                onClick={() => setStep(3)}
                disabled={!formData.companyName || !formData.contactEmail || !formData.businessType}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  background: (formData.companyName && formData.contactEmail && formData.businessType) ? '#3b82f6' : '#9ca3af',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: (formData.companyName && formData.contactEmail && formData.businessType) ? 'pointer' : 'not-allowed'
                }}
              >
                Continue to Service Areas
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.5rem' }}>
              Service Locations ({selectedPackage?.name})
            </h3>
            
            <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '1rem' }}>
              Select up to {maxLocations} location{maxLocations > 1 ? 's' : ''} where you provide services. 
              Your business will only appear in search results for these areas.
            </p>

            {formData.serviceLocations.length > 0 && (
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                  Selected Locations ({formData.serviceLocations.length}/{maxLocations})
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {formData.serviceLocations.map(location => (
                    <span 
                      key={location} 
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '0.25rem',
                        padding: '0.25rem 0.5rem',
                        background: '#f3f4f6',
                        borderRadius: '4px',
                        fontSize: '0.9rem'
                      }}
                    >
                      {location}
                      {location === formData.primaryLocation && <span style={{ color: '#3b82f6' }}>★</span>}
                      <button 
                        onClick={() => handleLocationRemove(location)}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          fontSize: '0.8rem',
                          padding: '0.125rem'
                        }}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {formData.serviceLocations.length < maxLocations && (
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Add Service Location</label>
                <select 
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '1rem'
                  }}
                  onChange={(e) => {
                    if (e.target.value) {
                      handleLocationAdd(e.target.value);
                      e.target.value = '';
                    }
                  }}
                >
                  <option value="">Choose a location...</option>
                  {UK_LOCATIONS
                    .filter(loc => !formData.serviceLocations.includes(loc))
                    .map(location => (
                      <option key={location} value={location}>
                        {location}
                      </option>
                    ))
                  }
                </select>
              </div>
            )}

            {formData.serviceLocations.length > 1 && (
              <div style={{ marginBottom: '2rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Primary Location</label>
                <select 
                  value={formData.primaryLocation} 
                  onChange={(e) => setFormData(prev => ({ ...prev, primaryLocation: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '1rem'
                  }}
                >
                  <option value="">Select primary location...</option>
                  {formData.serviceLocations.map(location => (
                    <option key={location} value={location}>
                      {location}
                    </option>
                  ))}
                </select>
                <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '0.25rem' }}>
                  Your primary location will be highlighted in search results
                </p>
              </div>
            )}

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button 
                onClick={() => setStep(2)}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: 'white',
                  color: '#374151',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                Back
              </button>
              <button 
                onClick={handleSubmit}
                disabled={formData.serviceLocations.length === 0}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  background: formData.serviceLocations.length > 0 ? 'linear-gradient(135deg, #3b82f6, #1d4ed8)' : '#9ca3af',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: formData.serviceLocations.length > 0 ? 'pointer' : 'not-allowed'
                }}
              >
                Submit Application
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}