import type { Request, Response } from 'express';
import { db } from '../db';
import { sql } from 'drizzle-orm';

interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  services: {
    database: ServiceStatus;
    sendgrid: ServiceStatus;
    memory: ServiceStatus;
  };
  uptime: number;
}

interface ServiceStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  responseTime?: number;
  error?: string;
  details?: any;
}

export async function healthCheck(req: Request, res: Response) {
  const health: HealthStatus = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    services: {
      database: await checkDatabase(),
      sendgrid: checkSendGrid(),
      memory: checkMemory()
    },
    uptime: process.uptime()
  };

  const serviceStatuses = Object.values(health.services).map(s => s.status);
  
  if (serviceStatuses.includes('unhealthy')) {
    health.status = 'unhealthy';
  } else if (serviceStatuses.includes('degraded')) {
    health.status = 'degraded';
  }

  const statusCode = health.status === 'healthy' ? 200 : 
                    health.status === 'degraded' ? 200 : 503;

  res.status(statusCode).json(health);
}

async function checkDatabase(): Promise<ServiceStatus> {
  const startTime = Date.now();
  
  try {
    await db.execute(sql`SELECT 1 as health_check`);
    
    return {
      status: 'healthy',
      responseTime: Date.now() - startTime
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      responseTime: Date.now() - startTime,
      error: error instanceof Error ? error.message : 'Database connection failed'
    };
  }
}

function checkSendGrid(): ServiceStatus {
  if (!process.env.SENDGRID_API_KEY) {
    return {
      status: 'degraded',
      error: 'SendGrid API key not configured'
    };
  }

  return {
    status: 'healthy',
    details: { configured: true }
  };
}

function checkMemory(): ServiceStatus {
  const usage = process.memoryUsage();
  const heapUsagePercent = (usage.heapUsed / usage.heapTotal) * 100;
  
  let status: ServiceStatus['status'] = 'healthy';
  if (heapUsagePercent > 90) {
    status = 'unhealthy';
  } else if (heapUsagePercent > 75) {
    status = 'degraded';
  }

  return {
    status,
    details: {
      heapUsagePercent: Math.round(heapUsagePercent)
    }
  };
}

export function readinessCheck(req: Request, res: Response) {
  res.status(200).json({
    status: 'ready',
    timestamp: new Date().toISOString()
  });
}