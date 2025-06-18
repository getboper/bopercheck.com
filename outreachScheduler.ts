import { CronJob } from 'cron';
import { publicBusinessOutreach } from './publicBusinessOutreach';

export class OutreachScheduler {
  private dailyOutreachJob: CronJob | null = null;
  
  constructor() {
    this.startScheduledOutreach();
  }
  
  startScheduledOutreach() {
    // Run public business outreach daily at 9 AM UK time
    this.dailyOutreachJob = new CronJob(
      '0 9 * * *', // 9:00 AM every day
      async () => {
        console.log('🚀 Starting scheduled public business outreach');
        try {
          const result = await publicBusinessOutreach.runPublicOutreach();
          console.log(`📊 Daily outreach complete: ${result.contacted} contacted, ${result.skipped} skipped, ${result.failed} failed`);
        } catch (error) {
          console.error('❌ Scheduled outreach failed:', error);
        }
      },
      null,
      true,
      'Europe/London'
    );
    
    console.log('📅 Outreach scheduler initialized - daily outreach at 9 AM UK time');
  }
  
  stopScheduledOutreach() {
    if (this.dailyOutreachJob) {
      this.dailyOutreachJob.stop();
      console.log('🛑 Outreach scheduler stopped');
    }
  }
  
  // Manual trigger for testing
  async runManualOutreach() {
    console.log('🔧 Running manual outreach trigger');
    return await publicBusinessOutreach.runPublicOutreach();
  }
}

export const outreachScheduler = new OutreachScheduler();