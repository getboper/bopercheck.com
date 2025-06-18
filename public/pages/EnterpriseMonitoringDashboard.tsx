import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Activity, AlertTriangle, CheckCircle, Clock, Database, Zap, Shield, TrendingUp, Server, Cpu } from "lucide-react";

interface SystemMetrics {
  searchMetrics: {
    recentSuccessRate: number;
    recentFailureRate: number;
    avgResponseTime: number;
    totalRequests: number;
    recentErrors: Array<{
      message: string;
      timestamp: string;
      severity: string;
    }>;
  };
  systemStatus: {
    database: boolean;
    aiService: boolean;
    emailService: boolean;
  };
  enterpriseAutoHealing: {
    health: {
      overall: boolean;
      services: Record<string, {
        healthy: boolean;
        lastCheck: number;
        latency: number;
      }>;
    };
    circuitBreakers: Record<string, { state: string }>;
    resourcePools: Record<string, {
      available: number;
      total: number;
      utilization: number;
      queueLength: number;
    }>;
    errorCounts: Record<string, {
      count: number;
      window: number[];
    }>;
  };
  timestamp: string;
}

export default function EnterpriseMonitoringDashboard() {
  const { data: metrics, isLoading, error } = useQuery<SystemMetrics>({
    queryKey: ['/api/monitoring/metrics'],
    refetchInterval: 3000, // Real-time updates every 3 seconds
    retry: 3,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-64"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-slate-200 dark:bg-slate-700 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !metrics) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-6">
        <div className="max-w-7xl mx-auto">
          <Card className="border-red-200 dark:border-red-800">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2 text-red-600 dark:text-red-400">
                <AlertTriangle className="h-5 w-5" />
                <span>Unable to load monitoring data</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const getStatusColor = (healthy: boolean) => 
    healthy ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400";

  const getStatusBadge = (healthy: boolean) => 
    healthy ? (
      <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
        <CheckCircle className="h-3 w-3 mr-1" />
        Healthy
      </Badge>
    ) : (
      <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
        <AlertTriangle className="h-3 w-3 mr-1" />
        Alert
      </Badge>
    );

  const formatLatency = (latency: number) => `${latency}ms`;
  const formatUptime = (lastCheck: number) => {
    const diff = Date.now() - lastCheck;
    const seconds = Math.floor(diff / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              Enterprise Monitoring Dashboard
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Real-time system health and auto-healing status
            </p>
          </div>
          <div className="flex items-center space-x-2 text-sm text-slate-500 dark:text-slate-400">
            <Clock className="h-4 w-4" />
            <span>Last updated: {new Date(metrics.timestamp).toLocaleTimeString()}</span>
          </div>
        </div>

        {/* System Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Success Rate</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    {(metrics.searchMetrics.recentSuccessRate * 100).toFixed(1)}%
                  </p>
                </div>
                <TrendingUp className={`h-8 w-8 ${
                  metrics.searchMetrics.recentSuccessRate > 0.85 
                    ? 'text-green-600 dark:text-green-400' 
                    : 'text-red-600 dark:text-red-400'
                }`} />
              </div>
              <Progress 
                value={metrics.searchMetrics.recentSuccessRate * 100} 
                className="mt-3"
              />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Response Time</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    {Math.round(metrics.searchMetrics.avgResponseTime)}ms
                  </p>
                </div>
                <Zap className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Total Requests</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    {metrics.searchMetrics.totalRequests.toLocaleString()}
                  </p>
                </div>
                <Activity className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">System Health</p>
                  <div className="mt-1">
                    {getStatusBadge(metrics.enterpriseAutoHealing.health.overall)}
                  </div>
                </div>
                <Shield className={`h-8 w-8 ${getStatusColor(metrics.enterpriseAutoHealing.health.overall)}`} />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="health" className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="health">Health Checks</TabsTrigger>
            <TabsTrigger value="circuits">Circuit Breakers</TabsTrigger>
            <TabsTrigger value="resources">Resource Pools</TabsTrigger>
            <TabsTrigger value="errors">Error Patterns</TabsTrigger>
            <TabsTrigger value="services">Core Services</TabsTrigger>
          </TabsList>

          <TabsContent value="health" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="h-5 w-5" />
                  <span>Service Health Monitoring</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(metrics.enterpriseAutoHealing.health.services).map(([service, status]) => (
                    <div key={service} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium capitalize">{service.replace('-', ' ')}</h3>
                        {getStatusBadge(status.healthy)}
                      </div>
                      <div className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
                        <div>Latency: {formatLatency(status.latency)}</div>
                        <div>Last Check: {formatUptime(status.lastCheck)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="circuits" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="h-5 w-5" />
                  <span>Circuit Breaker Status</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(metrics.enterpriseAutoHealing.circuitBreakers).map(([service, breaker]) => (
                    <div key={service} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium capitalize">{service}</h3>
                        <Badge className={
                          breaker.state === 'CLOSED' 
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : breaker.state === 'OPEN'
                            ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                            : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                        }>
                          {breaker.state}
                        </Badge>
                      </div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">
                        {breaker.state === 'CLOSED' && 'Operating normally'}
                        {breaker.state === 'OPEN' && 'Blocking requests'}
                        {breaker.state === 'HALF_OPEN' && 'Testing recovery'}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="resources" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Cpu className="h-5 w-5" />
                  <span>Resource Pool Management</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(metrics.enterpriseAutoHealing.resourcePools).map(([pool, status]) => (
                    <div key={pool} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-medium capitalize">{pool.replace('-', ' ')}</h3>
                        <Badge className={
                          status.utilization < 70 
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : status.utilization < 90
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                            : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                        }>
                          {status.utilization.toFixed(1)}% Used
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Available: {status.available}/{status.total}</span>
                          <span>Queue: {status.queueLength}</span>
                        </div>
                        <Progress value={status.utilization} className="h-2" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="errors" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5" />
                  <span>Error Pattern Analysis</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(metrics.enterpriseAutoHealing.errorCounts).map(([errorType, data]) => (
                    <div key={errorType} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium capitalize">{errorType.replace('-', ' ')}</h3>
                        <Badge className={
                          data.count < 5 
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : data.count < 10
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                            : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                        }>
                          {data.count} errors (5min)
                        </Badge>
                      </div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">
                        Last 5 minutes: {data.window.length} occurrences
                      </div>
                    </div>
                  ))}
                  {Object.keys(metrics.enterpriseAutoHealing.errorCounts).length === 0 && (
                    <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                      <CheckCircle className="h-12 w-12 mx-auto mb-3 text-green-500" />
                      <p>No error patterns detected in the last 5 minutes</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="services" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Server className="h-5 w-5" />
                  <span>Core Service Status</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Database className="h-5 w-5" />
                        <span className="font-medium">Database</span>
                      </div>
                      {getStatusBadge(metrics.systemStatus.database)}
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      PostgreSQL connection status
                    </p>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Zap className="h-5 w-5" />
                        <span className="font-medium">AI Service</span>
                      </div>
                      {getStatusBadge(metrics.systemStatus.aiService)}
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Anthropic API integration
                    </p>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Activity className="h-5 w-5" />
                        <span className="font-medium">Email Service</span>
                      </div>
                      {getStatusBadge(metrics.systemStatus.emailService)}
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      SendGrid notification system
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Errors */}
            {metrics.searchMetrics.recentErrors.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <AlertTriangle className="h-5 w-5" />
                    <span>Recent Errors</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {metrics.searchMetrics.recentErrors.slice(0, 5).map((error, index) => (
                      <div key={index} className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                        <div className="flex items-center justify-between mb-1">
                          <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 text-xs">
                            {error.severity}
                          </Badge>
                          <span className="text-xs text-slate-500">
                            {new Date(error.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                        <p className="text-sm text-slate-700 dark:text-slate-300 font-mono">
                          {error.message}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}