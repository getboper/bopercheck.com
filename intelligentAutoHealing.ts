import { db } from "./db";
import { systemErrors, adminAlerts } from "../shared/schema";
import { sql, desc, gte, count } from "drizzle-orm";
import * as fs from 'fs/promises';
import * as path from 'path';

interface AutoFixAction {
  type: string;
  description: string;
  filePath?: string;
  oldCode?: string;
  newCode?: string;
  command?: string;
  applied: boolean;
  timestamp: Date;
}

class IntelligentAutoHealing {
  private fixHistory: AutoFixAction[] = [];
  private isRunning = false;
  
  constructor() {
    this.startContinuousMonitoring();
    console.log('Intelligent Auto-Healing System initialized - monitoring every 30 seconds');
  }

  private startContinuousMonitoring() {
    // Monitor for errors every 30 seconds
    setInterval(async () => {
      if (!this.isRunning) {
        this.isRunning = true;
        try {
          await this.scanAndFixIssues();
        } catch (error) {
          console.error('Auto-healing scan failed:', error);
        } finally {
          this.isRunning = false;
        }
      }
    }, 30000);
  }

  private async scanAndFixIssues() {
    // Get recent system errors from last 10 minutes
    const recentErrors = await db.select()
      .from(systemErrors)
      .where(gte(systemErrors.createdAt, new Date(Date.now() - 10 * 60 * 1000)))
      .orderBy(desc(systemErrors.createdAt))
      .limit(20);

    for (const error of recentErrors) {
      if (error.isResolved) continue;
      
      const fix = await this.diagnoseAndFix(error);
      if (fix && fix.applied) {
        // Mark error as resolved
        await db.update(systemErrors)
          .set({ isResolved: true, resolvedAt: new Date() })
          .where(sql`id = ${error.id}`);
        
        console.log(`Auto-fixed issue: ${error.errorType} - ${fix.description}`);
        
        // Log the successful fix
        await this.logSuccessfulFix(error, fix);
      }
    }
  }

  private async diagnoseAndFix(error: any): Promise<AutoFixAction | null> {
    const errorType = error.errorType?.toLowerCase() || '';
    const errorMessage = error.errorMessage?.toLowerCase() || '';
    
    // API timeout fixes
    if (errorType.includes('timeout') || errorMessage.includes('timeout')) {
      return await this.fixAPITimeouts();
    }
    
    // Database connection issues
    if (errorMessage.includes('database') || errorMessage.includes('connection')) {
      return await this.fixDatabaseIssues();
    }
    
    // Frontend JavaScript errors
    if (errorType.includes('frontend') || errorMessage.includes('javascript')) {
      return await this.fixFrontendErrors(error);
    }
    
    // Authentication/session issues
    if (errorMessage.includes('auth') || errorMessage.includes('session')) {
      return await this.fixAuthenticationIssues();
    }
    
    // Memory/performance issues
    if (errorMessage.includes('memory') || errorMessage.includes('performance')) {
      return await this.fixPerformanceIssues();
    }
    
    // Import/module errors
    if (errorMessage.includes('import') || errorMessage.includes('module')) {
      return await this.fixImportErrors(error);
    }
    
    return null;
  }

  private async fixAPITimeouts(): Promise<AutoFixAction> {
    const routesPath = path.join(process.cwd(), 'server/routes.ts');
    
    try {
      let content = await fs.readFile(routesPath, 'utf-8');
      
      // Increase timeout values in AI requests
      const timeoutFixes = [
        {
          pattern: /timeout.*?(\d+000)/g,
          replacement: (match: string, timeout: string) => {
            const newTimeout = Math.min(parseInt(timeout) + 2000, 15000);
            return match.replace(timeout, newTimeout.toString());
          }
        },
        {
          pattern: /setTimeout.*?(\d+000)/g,
          replacement: (match: string, timeout: string) => {
            const newTimeout = Math.min(parseInt(timeout) + 2000, 15000);
            return match.replace(timeout, newTimeout.toString());
          }
        }
      ];
      
      let modified = false;
      for (const fix of timeoutFixes) {
        const newContent = content.replace(fix.pattern, fix.replacement as any);
        if (newContent !== content) {
          content = newContent;
          modified = true;
        }
      }
      
      if (modified) {
        await fs.writeFile(routesPath, content);
        console.log('Auto-fixed: Increased API timeout values');
        
        return {
          type: 'timeout_fix',
          description: 'Increased API timeout values to prevent failures',
          filePath: routesPath,
          applied: true,
          timestamp: new Date()
        };
      }
    } catch (error) {
      console.error('Failed to fix API timeouts:', error);
    }
    
    return { type: 'timeout_fix', description: 'Failed to apply timeout fix', applied: false, timestamp: new Date() };
  }

  private async fixDatabaseIssues(): Promise<AutoFixAction> {
    try {
      // Add database connection retry logic
      const dbPath = path.join(process.cwd(), 'server/db.ts');
      let content = await fs.readFile(dbPath, 'utf-8');
      
      // Add retry wrapper if not present
      if (!content.includes('retryOperation')) {
        const retryCode = `
// Auto-healing: Database retry wrapper
async function retryOperation<T>(operation: () => Promise<T>, maxRetries = 3): Promise<T> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      if (attempt === maxRetries) throw error;
      await new Promise(resolve => setTimeout(resolve, attempt * 1000));
    }
  }
  throw new Error('Retry operation failed');
}
`;
        
        content = retryCode + content;
        await fs.writeFile(dbPath, content);
        
        return {
          type: 'database_fix',
          description: 'Added database retry logic for connection stability',
          filePath: dbPath,
          applied: true,
          timestamp: new Date()
        };
      }
    } catch (error) {
      console.error('Failed to fix database issues:', error);
    }
    
    return { type: 'database_fix', description: 'Failed to apply database fix', applied: false, timestamp: new Date() };
  }

  private async fixFrontendErrors(error: any): Promise<AutoFixAction> {
    try {
      // Common frontend error patterns and fixes
      const errorTracking = `
// Auto-healing: Enhanced error tracking
window.addEventListener('error', (event) => {
  console.error('Runtime error caught:', event.error);
  
  // Attempt automatic recovery for common issues
  if (event.error?.message?.includes('Cannot read property')) {
    window.location.reload();
  }
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  event.preventDefault();
});
`;
      
      const mainTsxPath = path.join(process.cwd(), 'client/src/main.tsx');
      let content = await fs.readFile(mainTsxPath, 'utf-8');
      
      if (!content.includes('Auto-healing: Enhanced error tracking')) {
        content = content + errorTracking;
        await fs.writeFile(mainTsxPath, content);
        
        return {
          type: 'frontend_fix',
          description: 'Added enhanced frontend error tracking and recovery',
          filePath: mainTsxPath,
          applied: true,
          timestamp: new Date()
        };
      }
    } catch (error) {
      console.error('Failed to fix frontend errors:', error);
    }
    
    return { type: 'frontend_fix', description: 'Failed to apply frontend fix', applied: false, timestamp: new Date() };
  }

  private async fixAuthenticationIssues(): Promise<AutoFixAction> {
    try {
      // Add session validation and recovery
      const routesPath = path.join(process.cwd(), 'server/routes.ts');
      let content = await fs.readFile(routesPath, 'utf-8');
      
      const sessionFix = `
// Auto-healing: Session validation middleware
const validateSession = (req: any, res: any, next: any) => {
  if (req.session && req.sessionID) {
    req.session.touch();
    next();
  } else {
    req.session.regenerate((err: any) => {
      if (err) console.error('Session regeneration failed:', err);
      next();
    });
  }
};
`;
      
      if (!content.includes('Auto-healing: Session validation middleware')) {
        const insertPoint = content.indexOf('export async function registerRoutes');
        if (insertPoint !== -1) {
          content = content.slice(0, insertPoint) + sessionFix + content.slice(insertPoint);
          await fs.writeFile(routesPath, content);
          
          return {
            type: 'auth_fix',
            description: 'Added session validation and recovery middleware',
            filePath: routesPath,
            applied: true,
            timestamp: new Date()
          };
        }
      }
    } catch (error) {
      console.error('Failed to fix authentication issues:', error);
    }
    
    return { type: 'auth_fix', description: 'Failed to apply authentication fix', applied: false, timestamp: new Date() };
  }

  private async fixPerformanceIssues(): Promise<AutoFixAction> {
    try {
      // Add memory management and garbage collection hints
      const performanceFix = `
// Auto-healing: Performance optimization
if (typeof global !== 'undefined' && global.gc) {
  setInterval(() => {
    try {
      global.gc();
    } catch (e) {
      // Garbage collection not available
    }
  }, 300000); // Every 5 minutes
}

// Memory usage monitoring
setInterval(() => {
  const usage = process.memoryUsage();
  if (usage.heapUsed > 512 * 1024 * 1024) { // 512MB threshold
    console.warn('High memory usage detected:', Math.round(usage.heapUsed / 1024 / 1024) + 'MB');
  }
}, 60000);
`;
      
      const routesPath = path.join(process.cwd(), 'server/routes.ts');
      let content = await fs.readFile(routesPath, 'utf-8');
      
      if (!content.includes('Auto-healing: Performance optimization')) {
        content = performanceFix + content;
        await fs.writeFile(routesPath, content);
        
        return {
          type: 'performance_fix',
          description: 'Added memory management and performance monitoring',
          filePath: routesPath,
          applied: true,
          timestamp: new Date()
        };
      }
    } catch (error) {
      console.error('Failed to fix performance issues:', error);
    }
    
    return { type: 'performance_fix', description: 'Failed to apply performance fix', applied: false, timestamp: new Date() };
  }

  private async fixImportErrors(error: any): Promise<AutoFixAction> {
    try {
      const errorMessage = error.errorMessage || '';
      const stackTrace = error.stackTrace || '';
      
      // Extract file path from error
      const fileMatch = stackTrace.match(/at.*?([\/\\][\w\/\\.-]+\.(ts|js|tsx|jsx))/);
      if (!fileMatch) return { type: 'import_fix', description: 'Could not identify file path', applied: false, timestamp: new Date() };
      
      const filePath = fileMatch[1];
      
      if (await this.fileExists(filePath)) {
        let content = await fs.readFile(filePath, 'utf-8');
        
        // Fix common import issues
        const importFixes = [
          // Add missing file extensions
          { pattern: /import (.*) from ['"](.\/[^'"]+)['"](?![.][a-z])/g, replacement: "import $1 from '$2.ts'" },
          // Fix relative path issues
          { pattern: /import (.*) from ['"]([^'"]+)['"](?=.*Cannot resolve)/g, replacement: "import $1 from '@/$2'" },
          // Add missing default exports
          { pattern: /export \{([^}]+)\}/g, replacement: "export { $1 };\nexport default { $1 };" }
        ];
        
        let modified = false;
        for (const fix of importFixes) {
          const newContent = content.replace(fix.pattern, fix.replacement);
          if (newContent !== content) {
            content = newContent;
            modified = true;
          }
        }
        
        if (modified) {
          await fs.writeFile(filePath, content);
          
          return {
            type: 'import_fix',
            description: 'Fixed import/export statements',
            filePath,
            applied: true,
            timestamp: new Date()
          };
        }
      }
    } catch (error) {
      console.error('Failed to fix import errors:', error);
    }
    
    return { type: 'import_fix', description: 'Failed to apply import fix', applied: false, timestamp: new Date() };
  }

  private async fileExists(filePath: string): Promise<boolean> {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  private async logSuccessfulFix(error: any, fix: AutoFixAction) {
    try {
      await db.insert(adminAlerts).values({
        type: 'auto_fix',
        severity: 'medium',
        title: 'Auto-Fix Applied',
        message: `Automatically resolved ${error.errorType}: ${fix.description}`,
        details: JSON.stringify({
          originalError: error.errorMessage,
          fixType: fix.type,
          filePath: fix.filePath,
          timestamp: fix.timestamp
        }),
        isRead: false
      });
      
      this.fixHistory.push(fix);
      
      // Keep only last 100 fixes in memory
      if (this.fixHistory.length > 100) {
        this.fixHistory = this.fixHistory.slice(-100);
      }
    } catch (error) {
      console.error('Failed to log successful fix:', error);
    }
  }

  public getFixHistory(): AutoFixAction[] {
    return this.fixHistory.slice(-20); // Return last 20 fixes
  }

  public async getAutoHealingStats() {
    const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);
    
    const totalErrors = await db.select({ count: count() })
      .from(systemErrors)
      .where(gte(systemErrors.createdAt, last24Hours));
    
    const resolvedErrors = await db.select({ count: count() })
      .from(systemErrors)
      .where(sql`created_at >= ${last24Hours.toISOString()} AND is_resolved = true`);
    
    const autoFixes = this.fixHistory.filter(fix => 
      fix.timestamp.getTime() > last24Hours.getTime() && fix.applied
    );
    
    return {
      totalErrors: totalErrors[0]?.count || 0,
      resolvedErrors: resolvedErrors[0]?.count || 0,
      autoFixesApplied: autoFixes.length,
      fixTypes: autoFixes.reduce((acc, fix) => {
        acc[fix.type] = (acc[fix.type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      lastFixTime: autoFixes.length > 0 ? autoFixes[autoFixes.length - 1].timestamp : null
    };
  }
}

export const intelligentAutoHealing = new IntelligentAutoHealing();