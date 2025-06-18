// Configurable outreach system with GDPR compliance and safety controls
export interface OutreachConfig {
  dailyBatchSize: number;
  maxDailyEmails: number;
  enableSafetyThrottling: boolean;
  cooldownDays: number;
  categoriesPerDay: number;
  locationsPerDay: number;
  delayBetweenEmails: number; // milliseconds
  enableUnsubscribeTracking: boolean;
  enableBounceTracking: boolean;
}

export class OutreachConfigManager {
  private static config: OutreachConfig = {
    dailyBatchSize: 25, // Start conservative, can scale to 100-200
    maxDailyEmails: 250, // Hard safety limit
    enableSafetyThrottling: true,
    cooldownDays: 30,
    categoriesPerDay: 5,
    locationsPerDay: 8,
    delayBetweenEmails: 3000, // 3 seconds between emails
    enableUnsubscribeTracking: true,
    enableBounceTracking: true
  };

  static getConfig(): OutreachConfig {
    return { ...this.config };
  }

  static updateConfig(updates: Partial<OutreachConfig>): void {
    this.config = { ...this.config, ...updates };
    console.log('Outreach configuration updated:', updates);
  }

  static setBatchSize(size: number): void {
    if (size > this.config.maxDailyEmails) {
      throw new Error(`Batch size ${size} exceeds maximum daily limit ${this.config.maxDailyEmails}`);
    }
    this.config.dailyBatchSize = size;
    console.log(`Daily batch size updated to ${size}`);
  }

  static enableHighVolumeMode(): void {
    this.updateConfig({
      dailyBatchSize: 100,
      categoriesPerDay: 8,
      locationsPerDay: 12,
      delayBetweenEmails: 2000
    });
    console.log('High volume outreach mode enabled');
  }

  static enableConservativeMode(): void {
    this.updateConfig({
      dailyBatchSize: 25,
      categoriesPerDay: 5,
      locationsPerDay: 8,
      delayBetweenEmails: 3000
    });
    console.log('Conservative outreach mode enabled');
  }
}

export const outreachConfig = OutreachConfigManager;