import { useState, useEffect } from 'react';
import { History, Search, Bookmark, Trash2, Clock, Star } from 'lucide-react';

interface SearchItem {
  id: string;
  query: string;
  timestamp: string;
  results: number;
  saved: boolean;
}

export default function SearchHistory() {
  const [searchHistory, setSearchHistory] = useState<SearchItem[]>([]);
  const [savedItems, setSavedItems] = useState<SearchItem[]>([]);

  useEffect(() => {
    fetchSearchHistory();
  }, []);

  const fetchSearchHistory = async () => {
    try {
      const response = await fetch('/api/user/search-history');
      const data = await response.json();
      setSearchHistory(data.history || []);
      setSavedItems(data.saved || []);
    } catch (error) {
      console.error('Search history fetch error:', error);
    }
  };

  const saveSearch = async (searchId: string) => {
    try {
      const response = await fetch(`/api/user/search-history/${searchId}/save`, {
        method: 'POST'
      });
      
      if (response.ok) {
        fetchSearchHistory();
      }
    } catch (error) {
      console.error('Save search error:', error);
    }
  };

  const deleteSearch = async (searchId: string) => {
    try {
      const response = await fetch(`/api/user/search-history/${searchId}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        fetchSearchHistory();
      }
    } catch (error) {
      console.error('Delete search error:', error);
    }
  };

  const repeatSearch = (query: string) => {
    window.location.href = `/price-checker?q=${encodeURIComponent(query)}`;
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
      padding: '2rem',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        {/* Header */}
        <div style={{
          background: 'white',
          borderRadius: '20px',
          padding: '2rem',
          marginBottom: '2rem',
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <History style={{ width: '3rem', height: '3rem', color: '#0ea5e9' }} />
            <div>
              <h1 style={{
                fontSize: '2rem',
                fontWeight: '900',
                color: '#0c4a6e',
                margin: 0
              }}>
                Your Search History
              </h1>
              <p style={{ color: '#6b7280', margin: 0 }}>
                Revisit your past searches or save them for later
              </p>
            </div>
          </div>
        </div>

        {/* Recent Searches */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '2rem',
          marginBottom: '2rem',
          boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <Clock style={{ width: '1.5rem', height: '1.5rem', color: '#0ea5e9' }} />
            <h2 style={{ fontSize: '1.3rem', fontWeight: '700', color: '#0c4a6e', margin: 0 }}>
              Recent Searches
            </h2>
          </div>

          {searchHistory.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {searchHistory.map((search) => (
                <div
                  key={search.id}
                  style={{
                    background: '#f8fafc',
                    borderRadius: '12px',
                    padding: '1rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontSize: '1rem',
                      fontWeight: '600',
                      color: '#1e293b',
                      marginBottom: '0.25rem'
                    }}>
                      {search.query}
                    </div>
                    <div style={{ fontSize: '0.875rem', color: '#64748b' }}>
                      {new Date(search.timestamp).toLocaleDateString()} • {search.results} results
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={() => repeatSearch(search.query)}
                      style={{
                        background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '0.5rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      <Search style={{ width: '1rem', height: '1rem' }} />
                    </button>
                    
                    <button
                      onClick={() => saveSearch(search.id)}
                      style={{
                        background: '#10b981',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '0.5rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      <Bookmark style={{ width: '1rem', height: '1rem' }} />
                    </button>
                    
                    <button
                      onClick={() => deleteSearch(search.id)}
                      style={{
                        background: '#dc2626',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '0.5rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      <Trash2 style={{ width: '1rem', height: '1rem' }} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', color: '#6b7280', padding: '2rem' }}>
              No search history yet. Start searching to see your history here!
            </div>
          )}
        </div>

        {/* Saved Searches */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '2rem',
          boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <Star style={{ width: '1.5rem', height: '1.5rem', color: '#f59e0b' }} />
            <h2 style={{ fontSize: '1.3rem', fontWeight: '700', color: '#0c4a6e', margin: 0 }}>
              Saved for Later
            </h2>
          </div>

          {savedItems.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {savedItems.map((search) => (
                <div
                  key={search.id}
                  style={{
                    background: 'linear-gradient(135deg, #fef3c7, #fde68a)',
                    borderRadius: '12px',
                    padding: '1rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    border: '2px solid #f59e0b'
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontSize: '1rem',
                      fontWeight: '600',
                      color: '#92400e',
                      marginBottom: '0.25rem'
                    }}>
                      {search.query}
                    </div>
                    <div style={{ fontSize: '0.875rem', color: '#b45309' }}>
                      Saved on {new Date(search.timestamp).toLocaleDateString()} • {search.results} results
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={() => repeatSearch(search.query)}
                      style={{
                        background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '0.5rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      <Search style={{ width: '1rem', height: '1rem' }} />
                    </button>
                    
                    <button
                      onClick={() => deleteSearch(search.id)}
                      style={{
                        background: '#dc2626',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '0.5rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      <Trash2 style={{ width: '1rem', height: '1rem' }} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', color: '#6b7280', padding: '2rem' }}>
              No saved searches yet. Save searches from your recent history to access them quickly!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}