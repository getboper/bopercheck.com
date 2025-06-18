function SimpleApp() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <h1 style={{ 
          fontSize: '3rem', 
          fontWeight: 'bold', 
          color: '#1f2937', 
          marginBottom: '1rem' 
        }}>
          BoperCheck
        </h1>
        <p style={{ 
          fontSize: '1.25rem', 
          color: '#6b7280', 
          marginBottom: '2rem' 
        }}>
          AI-Powered Price Analysis
        </p>
        <div style={{ marginBottom: '1.5rem' }}>
          <input 
            type="text" 
            placeholder="Enter product description..." 
            style={{
              width: '400px',
              maxWidth: '90vw',
              padding: '12px 16px',
              border: '2px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '16px',
              outline: 'none'
            }}
            onFocus={(e) => e.target.style.borderColor = '#10b981'}
            onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
          />
        </div>
        <button 
          style={{
            backgroundColor: '#10b981',
            color: 'white',
            padding: '12px 32px',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#059669'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#10b981'}
        >
          Check Price
        </button>
        <div style={{ marginTop: '3rem', color: '#6b7280' }}>
          <p>✓ Compare prices across retailers</p>
          <p>✓ Get installation cost estimates</p>
          <p>✓ Find verified discount codes</p>
        </div>
      </div>
    </div>
  );
}

export default SimpleApp;