import type { Express } from "express";

export function registerPublicAdminAccess(app: Express): void {
  // Public admin dashboard access for external devices
  app.get("/boper-admin", async (req, res) => {
    try {
      // Auto-authenticate admin user
      (req.session as any).adminUser = {
        email: "njpards1@gmail.com",
        role: "admin",
        authenticatedAt: new Date().toISOString(),
        publicAccess: true
      };

      // Redirect to admin home dashboard
      res.redirect('/admin-home');
    } catch (error) {
      console.error('Public admin access error:', error);
      res.status(500).send('Admin access failed');
    }
  });

  // Alternative public access point
  app.get("/owner-dashboard", async (req, res) => {
    try {
      // Set admin session
      (req.session as any).adminUser = {
        email: "njpards1@gmail.com",
        role: "admin",
        authenticatedAt: new Date().toISOString(),
        ownerAccess: true
      };

      // Redirect to admin home
      res.redirect('/admin-home');
    } catch (error) {
      console.error('Owner dashboard access error:', error);
      res.status(500).send('Dashboard access failed');
    }
  });

  // Mobile-optimized admin dashboard
  app.get("/mobile-admin", async (req, res) => {
    try {
      // Auto-authenticate for mobile
      (req.session as any).adminUser = {
        email: "njpards1@gmail.com",
        role: "admin",
        authenticatedAt: new Date().toISOString(),
        mobileAccess: true
      };

      // Serve mobile-optimized HTML directly
      res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>BoperCheck Admin - Mobile</title>
    <meta name="robots" content="noindex, nofollow">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }
        .container { max-width: 600px; margin: 0 auto; }
        .header { 
            background: rgba(255,255,255,0.95); 
            padding: 20px; 
            border-radius: 15px; 
            margin-bottom: 20px; 
            text-align: center;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }
        .title { font-size: 24px; font-weight: bold; color: #333; margin-bottom: 10px; }
        .status { color: #10b981; font-weight: 600; }
        .card { 
            background: rgba(255,255,255,0.95); 
            padding: 20px; 
            border-radius: 15px; 
            margin-bottom: 15px;
            box-shadow: 0 8px 25px rgba(0,0,0,0.15);
        }
        .metric { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; }
        .metric-label { font-weight: 600; color: #555; }
        .metric-value { font-size: 18px; font-weight: bold; color: #333; }
        .button { 
            display: block; 
            width: 100%; 
            padding: 15px; 
            background: #667eea; 
            color: white; 
            text-decoration: none; 
            text-align: center; 
            border-radius: 10px; 
            font-weight: 600;
            margin-bottom: 10px;
            transition: all 0.3s ease;
        }
        .button:hover { background: #5a6fd8; transform: translateY(-2px); }
        .alert { 
            background: #fee2e2; 
            border-left: 4px solid #ef4444; 
            padding: 15px; 
            border-radius: 8px; 
            margin-bottom: 15px;
        }
        .loading { text-align: center; padding: 40px; }
        .spinner { 
            width: 40px; 
            height: 40px; 
            border: 4px solid #e5e7eb; 
            border-top: 4px solid #667eea; 
            border-radius: 50%; 
            animation: spin 1s linear infinite; 
            margin: 0 auto 20px;
        }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="title">BoperCheck Admin</div>
            <div class="status">System Operational</div>
        </div>
        
        <div id="loading" class="loading">
            <div class="spinner"></div>
            <p>Loading dashboard data...</p>
        </div>
        
        <div id="dashboard" style="display: none;">
            <div class="card">
                <div class="metric">
                    <span class="metric-label">Total Searches</span>
                    <span class="metric-value" id="totalSearches">-</span>
                </div>
                <div class="metric">
                    <span class="metric-label">Today's Searches</span>
                    <span class="metric-value" id="todaySearches">-</span>
                </div>
                <div class="metric">
                    <span class="metric-label">Active Users</span>
                    <span class="metric-value" id="activeUsers">-</span>
                </div>
                <div class="metric">
                    <span class="metric-label">Total Revenue</span>
                    <span class="metric-value" id="totalRevenue">-</span>
                </div>
            </div>
            
            <div id="alerts" class="card" style="display: none;">
                <h3 style="margin-bottom: 15px; color: #ef4444;">Critical Alerts</h3>
                <div id="alertsList"></div>
            </div>
            
            <a href="/admin-home" class="button">Open Full Dashboard</a>
            <a href="javascript:location.reload()" class="button" style="background: #10b981;">Refresh Data</a>
        </div>
    </div>
    
    <script>
        async function loadDashboardData() {
            try {
                const response = await fetch('/api/admin/realtime-data');
                const data = await response.json();
                
                // Update metrics
                document.getElementById('totalSearches').textContent = data.overview.totalSearches.toLocaleString();
                document.getElementById('todaySearches').textContent = data.overview.todaySearches;
                document.getElementById('activeUsers').textContent = data.overview.totalUsers.toLocaleString();
                document.getElementById('totalRevenue').textContent = '£' + data.overview.totalRevenue.toFixed(2);
                
                // Show alerts if any
                if (data.alerts.unread && data.alerts.unread.length > 0) {
                    const alertsDiv = document.getElementById('alerts');
                    const alertsList = document.getElementById('alertsList');
                    alertsList.innerHTML = '';
                    
                    data.alerts.unread.slice(0, 3).forEach(alert => {
                        const alertDiv = document.createElement('div');
                        alertDiv.className = 'alert';
                        alertDiv.innerHTML = \`
                            <strong>\${alert.severity.toUpperCase()}: \${alert.title}</strong><br>
                            <span style="font-size: 14px;">\${alert.message}</span>
                        \`;
                        alertsList.appendChild(alertDiv);
                    });
                    
                    alertsDiv.style.display = 'block';
                }
                
                // Hide loading, show dashboard
                document.getElementById('loading').style.display = 'none';
                document.getElementById('dashboard').style.display = 'block';
                
            } catch (error) {
                console.error('Failed to load dashboard data:', error);
                document.getElementById('loading').innerHTML = '<p style="color: #ef4444;">Failed to load data. <a href="javascript:location.reload()">Try again</a></p>';
            }
        }
        
        // Load data when page loads
        loadDashboardData();
        
        // Auto-refresh every 60 seconds
        setInterval(loadDashboardData, 60000);
    </script>
</body>
</html>
      `);
    } catch (error) {
      console.error('Mobile admin access error:', error);
      res.status(500).send('Mobile dashboard access failed');
    }
  });
}