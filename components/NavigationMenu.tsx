import { useState, useEffect } from 'react';
import { Menu, X, Home, Search, Gift, BarChart3, PiggyBank, Building2, Shield, Mail, Gamepad2, Bot, CreditCard, Trophy, Wallet, Lock, History, CheckCircle, Bell } from 'lucide-react';

interface NavigationMenuProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export default function NavigationMenu({ currentPage, onNavigate }: NavigationMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isBusinessAuthenticated, setIsBusinessAuthenticated] = useState(false);
  const [businessName, setBusinessName] = useState('');

  useEffect(() => {
    // Check for business authentication
    const token = localStorage.getItem('businessToken');
    const name = localStorage.getItem('businessName');
    if (token && name) {
      setIsBusinessAuthenticated(true);
      setBusinessName(name);
    }
  }, []);

  const baseMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'price-checker', label: 'Price Checker', icon: Search },
    { id: 'voucher-wallet', label: 'My Voucher Pot', icon: Wallet },
    { id: 'business', label: 'Business Advertising', icon: Building2 },
    { id: 'weekly-report', label: 'Reports', icon: BarChart3 },
    { id: 'admin-dashboard', label: 'Admin Dashboard', icon: Shield }
  ];

  // Only show business portal to authenticated business owners
  const menuItems = isBusinessAuthenticated 
    ? [
        ...baseMenuItems.slice(0, 5),
        { id: 'business-dashboard', label: `${businessName} Portal`, icon: Building2 },
        ...baseMenuItems.slice(5)
      ]
    : baseMenuItems;

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleMenu}
        style={{
          position: 'fixed',
          top: '1rem',
          left: '1rem',
          zIndex: 1000,
          background: '#4f46e5',
          color: 'white',
          border: 'none',
          borderRadius: '12px',
          padding: '0.75rem',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
        <span style={{ fontSize: '0.875rem', fontWeight: '600' }}>
          {isOpen ? 'Close' : 'Menu'}
        </span>
      </button>

      {/* Navigation Menu */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 999,
            display: 'flex'
          }}
          onClick={toggleMenu}
        >
          <div
            style={{
              background: 'white',
              width: '300px',
              height: '100%',
              padding: '2rem',
              boxShadow: '2px 0 20px rgba(0,0,0,0.1)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ marginBottom: '2rem', paddingTop: '2rem' }}>
              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: '#1e3a8a',
                margin: 0,
                textAlign: 'center'
              }}>
                BoperCheck
              </h2>
              <p style={{
                fontSize: '0.875rem',
                color: '#6b7280',
                margin: '0.5rem 0 0 0',
                textAlign: 'center'
              }}>
                AI-Powered Price Comparison
              </p>
            </div>

            <div style={{ flex: 1 }}>
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;
                
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onNavigate(item.id);
                      setIsOpen(false);
                    }}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      padding: '1rem',
                      border: 'none',
                      borderRadius: '12px',
                      background: isActive ? '#4f46e5' : 'transparent',
                      color: isActive ? 'white' : '#374151',
                      cursor: 'pointer',
                      fontSize: '1rem',
                      fontWeight: '500',
                      marginBottom: '0.5rem',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.background = '#f3f4f6';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.background = 'transparent';
                      }
                    }}
                  >
                    <Icon size={20} />
                    {item.label}
                  </button>
                );
              })}
            </div>

            <div style={{
              borderTop: '1px solid #e5e7eb',
              paddingTop: '1rem',
              fontSize: '0.75rem',
              color: '#9ca3af',
              textAlign: 'center'
            }}>
              <p style={{ margin: 0 }}>Version 1.0</p>
              <p style={{ margin: '0.25rem 0 0 0' }}>Live Mode Active</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}